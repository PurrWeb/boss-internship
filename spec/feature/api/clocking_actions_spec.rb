require 'rails_helper'

RSpec.describe 'Clocking actions' do
  include Rack::Test::Methods
  include HeaderHelpers

  let(:venue) { FactoryGirl.create(:venue) }
  let(:staff_member) { FactoryGirl.create(:staff_member, venues: [venue])}
  let(:user) { FactoryGirl.create(:user, venues: [venue]) }
  let(:day_start) { RotaShiftDate.new(Time.current).start_time }
  let(:date) { RotaShiftDate.to_rota_date(day_start) }
  let(:access_token) do
    AccessToken.create!(
      token_type: 'api',
      expires_at: 30.minutes.from_now,
      creator: user,
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
        staff_member_id: staff_member.id,
        date: UIRotaDate.format(date),
        at: (day_start + 4.hours).iso8601,
        venue_id: venue.id
      }
    end

    context 'before call' do
      specify 'no clock ins should exist' do
        expect(ClockingEvent.count).to eq(0)
      end

      specify 'no interval should exist' do
        expect(ClockInInterval.count).to eq(0)
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
          staff_member_id: staff_member.id,
          date: UIRotaDate.format(date),
          at: (day_start + 5.hours).iso8601,
          venue_id: venue.id
        }
      end

      before do
        ClockingEvent.create!(
          venue: venue,
          staff_member: staff_member,
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
          staff_member_id: staff_member.id,
          date: UIRotaDate.format(date),
          at: (day_start + 5.hours).iso8601,
          venue_id: venue.id
        }
      end

      before do
        ClockingEvent.create!(
          venue: venue,
          staff_member: staff_member,
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

      specify 'should create interval' do
        post(url, params)
        expect(ClockInInterval.count).to eq(1)
        expect(ClockInInterval.last.interval_type).to eq('clock_in')
      end
    end
  end

  describe '#start_break' do
    let(:url) { url_helpers.start_break_api_v1_clocking_index_path }

    context 'when last event is a clock_in' do
      let(:params) do
        {
          staff_member_id: staff_member.id,
          date: UIRotaDate.format(date),
          at: (day_start + 5.hours).iso8601,
          venue_id: venue.id
        }
      end

      before do
        ClockingEvent.create!(
          venue: venue,
          staff_member: staff_member,
          at: day_start + 1.hour,
          creator: staff_member,
          event_type: 'clock_in'
        )
      end

      context 'before call' do
        specify 'no clock outs should exist' do
          expect(ClockingEvent.count).to eq(1)
        end

        specify 'no interval should exist' do
          expect(ClockInInterval.count).to eq(0)
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
    end
  end

  describe '#end_break' do
    let(:url) { url_helpers.end_break_api_v1_clocking_index_path }

    context 'when last event is a clock_in' do
      let(:params) do
        {
          staff_member_id: staff_member.id,
          date: UIRotaDate.format(date),
          at: (day_start + 5.hours).iso8601,
          venue_id: venue.id
        }
      end

      before do
        ClockingEvent.create!(
          venue: venue,
          staff_member: staff_member,
          at: day_start + 1.hour,
          creator: staff_member,
          event_type: 'clock_in'
        )
        ClockingEvent.create!(
          venue: venue,
          staff_member: staff_member,
          at: day_start + 1.hour + 30.minutes,
          creator: staff_member,
          event_type: 'start_break'
        )
      end

      context 'before call' do
        specify 'no clock outs should exist' do
          expect(ClockingEvent.count).to eq(2)
        end

        specify 'no interval should exist' do
          expect(ClockInInterval.count).to eq(0)
        end
      end

      specify 'should work' do
        response = post(url, params)
        expect(response.status).to eq(ok_status)
      end

      specify 'should create event' do
        post(url, params)
        expect(ClockingEvent.count).to eq(3)
        expect(ClockingEvent.last.event_type).to eq('end_break')
      end

      specify 'should create interval' do
        post(url, params)
        expect(ClockInInterval.count).to eq(1)
        expect(ClockInInterval.last.interval_type).to eq('break')
      end
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
