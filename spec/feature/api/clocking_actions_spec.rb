require 'rails_helper'

RSpec.describe 'Clocking actions' do
  include Rack::Test::Methods
  include HeaderHelpers
  include ActiveSupport::Testing::TimeHelpers

  let(:venue) { FactoryGirl.create(:venue) }
  let(:api_key) do
    ApiKey.create!(venue: venue, user: user)
  end
  let(:staff_member) do
    FactoryGirl.create(:staff_member, staff_type: manager_staff_type)
  end
  let(:manager_staff_type) { FactoryGirl.create(:manager_staff_type) }
  let(:user) { FactoryGirl.create(:user, venues: [venue]) }
  let(:day_start) { RotaShiftDate.new(Time.current).start_time }
  let(:date) { RotaShiftDate.to_rota_date(day_start) }
  let(:target_staff_member) { FactoryGirl.create(:staff_member) }
  let(:access_token) do
    AccessToken.create!(
      token_type: 'api',
      expires_at: 30.minutes.from_now,
      creator: user,
      api_key: api_key,
      staff_member: staff_member
    )
  end

  before do
    set_token_header(access_token)
  end

  describe '#clock_in' do
    let(:url) { url_helpers.clock_in_api_v1_clocking_index_path }
    let(:params) do
      {
        staff_member_id: target_staff_member.id,
        date: date.iso8601
      }
    end

    context 'before call' do
      specify 'no clock ins should exist' do
        expect(ClockingEvent.count).to eq(0)
      end

      specify 'no clock in period should exist' do
        expect(ClockInPeriod.count).to eq(0)
      end
    end

    specify 'should work' do
      response = post(url, params)
      expect(response.status).to eq(ok_status)
    end

    specify 'should create event' do
      post(url, params)
      expect(ClockingEvent.count).to eq(1)
    end

    context 'when previous events exist' do
      let(:params) do
        {
          staff_member_id: target_staff_member.id,
          date: date.iso8601
        }
      end

      before do
        ClockingEvent.create!(
          venue: venue,
          staff_member: target_staff_member,
          at: day_start + 1.hour,
          creator: staff_member,
          event_type: 'clock_in'
        )
      end

      specify 'creation should fail' do
        expect{
          post(url, params)
        }.to raise_error('illegal attempt to transistion from clocked_in to clocked_in')
      end
    end
  end

  describe '#clock_out' do
    let(:url) { url_helpers.clock_out_api_v1_clocking_index_path }

    context 'when last event is a clock_in' do
      let(:params) do
        {
          staff_member_id: target_staff_member.id,
          date: date.iso8601
        }
      end

      before do
        ClockingEvent.create!(
          venue: venue,
          staff_member: target_staff_member,
          at: day_start + 1.hour,
          creator: staff_member,
          event_type: 'clock_in'
        )
      end

      context 'before call' do
        specify 'no clock outs should exist' do
          expect(ClockingEvent.count).to eq(1)
        end
      end

      specify 'should work' do
        response = post(url, params)
        expect(response.status).to eq(ok_status)
      end

      specify 'should create event' do
        post(url, params)
        expect(ClockingEvent.count).to eq(2)
        expect(ClockingEvent.last.event_type).to eq('clock_out')
      end

      specify 'should create period' do
        call_time = day_start + 2.hours
        travel_to call_time do
          post(url, params)
        end
        expect(ClockInPeriod.count).to eq(1)
        period = ClockInPeriod.last
        expect(period.period_type).to eq('recorded')
        expect(period.clocking_events.to_a).to eq([ClockingEvent.last])
        expect(period.venue).to eq(venue)
        expect(period.date).to eq(date)
        expect(period.staff_member).to eq(target_staff_member)
        expect(period.starts_at).to eq(call_time)
        expect(period.clock_in_period_reason).to eq(nil)
      end
    end
  end

  describe '#start_break' do
    let(:url) { url_helpers.start_break_api_v1_clocking_index_path }
    let(:clock_in_event) do
      ClockingEvent.create!(
        venue: venue,
        staff_member: target_staff_member,
        at: day_start + 1.hour,
        creator: staff_member,
        event_type: 'clock_in'
      )
    end

    context 'when last event is a clock_in' do
      let(:params) do
        {
          staff_member_id: target_staff_member.id,
          date: date.iso8601
        }
      end

      before do
        ClockInPeriod.create!(
          period_type: 'recorded',
          venue: venue,
          creator: staff_member,
          staff_member: target_staff_member,
          date: date,
          starts_at: day_start + 1.hour,
          clocking_events: [clock_in_event]
        )
      end

      context 'before call' do
        specify 'no clock outs should exist' do
          expect(ClockingEvent.count).to eq(1)
        end

        specify 'one clocking period should exist' do
          expect(ClockInPeriod.count).to eq(1)
        end
      end

      specify 'should work' do
        response = post(url, params)
        expect(response.status).to eq(ok_status)
      end

      specify 'should create event' do
        post(url, params)
        expect(ClockingEvent.count).to eq(2)
        expect(ClockingEvent.last.event_type).to eq('start_break')
      end

      specify 'should not create extra period' do
        post(url, params)
        expect(ClockInPeriod.count).to eq(1)
      end

      specify 'should save event with period' do
        post(url, params)
        period = ClockInPeriod.last
        expect(
          period.clocking_events.count
        ).to eq(2)

        expect(
          period.clocking_events.last
        ).to eq(ClockingEvent.last)
      end
    end
  end

  describe '#end_break' do
    let(:url) { url_helpers.end_break_api_v1_clocking_index_path }
    let(:start_break_time) { day_start + 1.hour + 30.minutes }

    context 'when last event is a start_break' do
      let(:params) do
        {
          staff_member_id: target_staff_member.id,
          date: date.iso8601
        }
      end

      before do
        clock_in_event = ClockingEvent.create!(
          venue: venue,
          staff_member: target_staff_member,
          at: day_start + 1.hour,
          creator: staff_member,
          event_type: 'clock_in'
        )
        start_break_event = ClockingEvent.create!(
          venue: venue,
          staff_member: target_staff_member,
          at: start_break_time,
          creator: staff_member,
          event_type: 'start_break'
        )
        ClockInPeriod.create!(
          period_type: 'recorded',
          venue: venue,
          creator: staff_member,
          staff_member: target_staff_member,
          date: date,
          starts_at: day_start + 1.hour,
          clocking_events: [clock_in_event, start_break_event]
        )
      end

      context 'before call' do
        specify '2 events should exist' do
          expect(ClockingEvent.count).to eq(2)
        end

        specify 'clock in period should exist' do
          expect(ClockInPeriod.count).to eq(1)
        end

        specify 'no breaks should exist' do
          expect(ClockInBreak.count).to eq(0)
        end
      end

      specify 'should work' do
        response = post(url, params)
        expect(response.status).to eq(ok_status)
      end

      specify 'should not create extra period' do
        post(url, params)
        expect(ClockInPeriod.count).to eq(1)
      end

      specify 'should create event' do
        post(url, params)
        expect(ClockingEvent.count).to eq(3)
        expect(ClockingEvent.last.event_type).to eq('end_break')
      end

      specify 'should add event to period' do
        post(url, params)
        period = ClockInPeriod.last
        expect(period.clocking_events.last).to eq(ClockingEvent.last)
      end

      specify 'should create break' do
        post(url, params)
        expect(ClockInBreak.count).to eq(1)
      end

      specify 'should associate break with period' do
        post(url, params)
        expect(
          ClockInPeriod.last.clock_in_breaks.last
        ).to eq(
          ClockInBreak.last
        )
      end

      specify 'break should have correct times' do
        end_break_time = day_start + 3.hours
        travel_to end_break_time do
          post(url, params)
        end

        _break = ClockInBreak.last
        expect(_break.starts_at).to eq(start_break_time)
        expect(_break.ends_at).to eq(end_break_time)
      end
    end
  end

  describe '#add_note' do
    let(:url) { url_helpers.add_note_api_v1_clocking_index_path }
    let(:params) do
      {
        creator: user,
        staff_member_id: target_staff_member.id,
        date: date.iso8601,
        note: note
      }
    end
    let(:note) { 'this is the note' }

    context 'before call' do
      specify 'no clock outs should exist' do
        expect(ClockInNote.count).to eq(0)
      end
    end

    specify 'should create a note' do
      post(url, params)
      created_note = ClockInNote.find_by(
        staff_member: target_staff_member,
        creator: staff_member,
        venue: venue,
        date: date.iso8601
      )
      expect(created_note).to be_present
      expect(created_note.note).to eq(note)
    end
  end

  private
  def app
    Rails.application
  end

  def url_helpers
    Rails.application.routes.url_helpers
  end

  def ok_status
    200
  end

  def unprocessable_entity_status
    422
  end
end
