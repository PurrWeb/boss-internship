require 'rails_helper'
require 'feature/support/clocking_action_helper'

RSpec.describe 'Clocking actions' do
  include Rack::Test::Methods
  include HeaderHelpers
  include ActiveSupport::Testing::TimeHelpers

  let(:mock_clocking_app_frontend_updates_service) do
    double 'mock clocking app frontend updates service'
  end

  before do
    allow(ClockingAppFrontendUpdates).to receive(:new).and_return(mock_clocking_app_frontend_updates_service)
    allow(mock_clocking_app_frontend_updates_service).to(receive(:clocking_events_updates))
    allow(mock_clocking_app_frontend_updates_service).to(receive(:dispatch))
  end

  let(:venue) { FactoryGirl.create(:venue) }
  let(:api_key) do
    ApiKey.create!(venue: venue, user: user, key_type: ApiKey::BOSS_KEY_TYPE)
  end
  let(:staff_member) do
    FactoryGirl.create(:staff_member, staff_type: manager_staff_type)
  end
  let(:manager_staff_type) { FactoryGirl.create(:manager_staff_type) }
  let(:user) { FactoryGirl.create(:user, venues: [venue]) }
  let(:day_start) { RotaShiftDate.new(Time.current).start_time }
  let(:date) { RotaShiftDate.to_rota_date(day_start) }
  let(:target_staff_member) { FactoryGirl.create(:staff_member) }
  let(:token_expires_at) { 30.minutes.from_now }
  let(:access_token) do
    ApiAccessToken.new(
      staff_member: staff_member,
      api_key: api_key
    ).persist!
  end
  let(:now) { Time.current }
  let(:call_time) { now }

  around(:each) do |example|
    travel_to call_time do
      example.run
    end
  end

  before do
    set_authorization_header(access_token.token)
  end

  describe '#clock_in' do
    let(:url) { url_helpers.clock_in_api_v1_clocking_index_path }
    let(:params) do
      {
        staff_member_id: target_staff_member.id
      }
    end

    context 'before call' do
      specify 'no clock ins should exist' do
        expect(ClockInEvent.count).to eq(0)
      end

      specify 'no clock in period should exist' do
        expect(ClockInPeriod.count).to eq(0)
      end

      specify 'no clock in day should exist' do
        expect(ClockInDay.count).to eq(0)
      end

      specify 'no hours acceptance period should exist' do
        expect(HoursAcceptancePeriod.count).to eq(0)
      end
    end

    specify 'should work' do
      response = post(url, params)
      expect(response.status).to eq(ok_status)
    end

    specify 'should create event' do
      post(url, params)
      expect(ClockInEvent.count).to eq(1)
    end

    specify 'should create clocking period' do
      post(url, params)
      expect(ClockInPeriod.count).to eq(1)
    end

    specify 'clock in day should be created' do
      post(url, params)
      expect(ClockInDay.count).to eq(1)
    end

    specify 'no hours acceptance period should be created' do
      post(url, params)
      expect(HoursAcceptancePeriod.count).to eq(0)
    end

    specify 'should update the finance report' do
      expect(
        FinanceReport.where(staff_member: target_staff_member).count
      ).to eq(0)
      post(url, params)
      expect(
        FinanceReport.where(staff_member: target_staff_member).count
      ).to eq(1)
      finance_report = FinanceReport.where(staff_member: target_staff_member).first
      expect(finance_report.staff_member).to eq(target_staff_member)
      expect(finance_report.requiring_update?).to eq(true)
    end

    context 'when previous events exist' do
      let(:params) do
        {
          staff_member_id: target_staff_member.id,
          date: date.iso8601
        }
      end

      before do
        starts_at = day_start + 1.hour

        clock_in_day = ClockInDay.create!(
          staff_member: target_staff_member,
          date: date,
          venue: venue,
          creator: user
        )

        ClockingActionHelper.create_initial_clock_in(
          clock_in_day: clock_in_day,
          creator: staff_member,
          at: starts_at
        )
      end

      specify 'creation should fail' do
        response = post(url, params)
        expect(response.status).to eq(unprocessable_entity_status)
      end
    end
  end

  describe '#clock_out' do
    let(:url) { url_helpers.clock_out_api_v1_clocking_index_path }
    let(:call_time) { day_start + 2.hours }

    context 'when last event is a clock_in' do
      let(:params) do
        {
          staff_member_id: target_staff_member.id
        }
      end

      before do
        starts_at = day_start + 1.hour

        clock_in_day = ClockInDay.create!(
          staff_member: target_staff_member,
          venue: venue,
          date: date,
          creator: staff_member
        )

        ClockingActionHelper.create_initial_clock_in(
          clock_in_day: clock_in_day,
          creator: staff_member,
          at: starts_at
        )
      end

      context 'before call' do
        specify 'no clock outs should exist' do
          expect(ClockInEvent.count).to eq(1)
        end

        specify '1 clock in period should exist' do
          expect(ClockInPeriod.count).to eq(1)
        end

        specify '1 clock in day should exist' do
          expect(ClockInDay.count).to eq(1)
        end

        specify 'no hours acceptance period should exist' do
          expect(HoursAcceptancePeriod.count).to eq(0)
        end
      end

      specify 'should work' do
        response = post(url, params)
        expect(response.status).to eq(ok_status)
      end

      specify 'should create event' do
        post(url, params)
        expect(ClockInEvent.count).to eq(2)
        expect(ClockInEvent.last.event_type).to eq('clock_out')
      end

      specify 'should associate event with create period' do
        token = ApiAccessToken.new(
          expires_at: 30.minutes.from_now,
          api_key: api_key,
          staff_member: staff_member
        ).persist!

        set_authorization_header(token.token)
        post(url, params)
        set_authorization_header(access_token.token)

        expect(ClockInPeriod.count).to eq(1)
        period = ClockInPeriod.last
        clock_out_event = ClockInEvent.last
        expect(period.clock_in_events.count).to eq(2)
        expect(period.clock_in_events.last).to eq(clock_out_event)
        expect(period.ends_at).to eq(clock_out_event.at)
      end

      specify 'a matching hours acceptance period should be created' do
        post(url, params)
        expect(HoursAcceptancePeriod.count).to eq(1)
        clock_in_period = ClockInPeriod.last
        hours_acceptance_period = HoursAcceptancePeriod.last

        expect(hours_acceptance_period.clock_in_day).to eq(clock_in_period.clock_in_day)
        expect(hours_acceptance_period.starts_at).to eq(clock_in_period.starts_at)
        expect(hours_acceptance_period.ends_at).to eq(clock_in_period.ends_at)
      end

      specify 'should update the finance report' do
        expect(
          FinanceReport.where(staff_member: target_staff_member).count
        ).to eq(0)
        post(url, params)
        expect(
          FinanceReport.where(staff_member: target_staff_member).count
        ).to eq(1)
        finance_report = FinanceReport.where(staff_member: target_staff_member).first
        expect(finance_report.staff_member).to eq(target_staff_member)
        expect(finance_report.requiring_update?).to eq(true)
      end
    end

    context 'when clock in period has breaks' do
      let(:params) do
        {
          staff_member_id: target_staff_member.id
        }
      end

      let(:shift_start) { day_start + 1.hour }
      let(:break_start) { shift_start + 2.hours }
      let(:break_end) { shift_start + 3.hours }
      let(:call_time) { break_end + 1.hour }
      let(:token_expires_at) { call_time + 30.minutes }
      let(:clock_in_day) do
        ClockInDay.create!(
          staff_member: target_staff_member,
          venue: venue,
          date: date,
          creator: staff_member
        )
      end

      before do
        ClockingActionHelper.create_initial_clock_in(
          clock_in_day: clock_in_day,
          creator: staff_member,
          at: shift_start
        )

        clock_in_period = ClockInPeriod.last

        ClockingActionHelper.add_event_to_period(
          clock_in_period: clock_in_period,
          event_type: 'start_break',
          creator: staff_member,
          at: break_start
        )

        ClockingActionHelper.add_event_to_period(
          clock_in_period: clock_in_period,
          event_type: 'end_break',
          creator: staff_member,
          at: break_end
        )

        ClockInBreak.create!(
          starts_at: break_start,
          ends_at: break_end,
          clock_in_period: clock_in_period
        )
      end

      context 'before call' do
        specify 'no hours acceptance period should exist' do
          expect(HoursAcceptancePeriod.count).to eq(0)
        end

        specify 'no hours acceptance breaks should exist' do
          expect(HoursAcceptanceBreak.count).to eq(0)
        end
      end

      specify 'should work' do
        response = post(url, params)
        expect(response.status).to eq(ok_status)
      end

      specify 'hours acceptance period should be created with a matching break' do
        post(url, params)
        expect(HoursAcceptancePeriod.count).to eq(1)
        clock_in_period = ClockInPeriod.last
        hours_acceptance_period = HoursAcceptancePeriod.last

        expect(hours_acceptance_period.hours_acceptance_breaks.count).to eq(1)
        hours_acceptance_break = hours_acceptance_period.hours_acceptance_breaks.last
        expect(hours_acceptance_break.starts_at).to eq(break_start)
        expect(hours_acceptance_break.ends_at).to eq(break_end)
      end

      context 'when created acceptance will clash with existing' do
        before do
          HoursAcceptancePeriod.create!(
            starts_at: shift_start,
            ends_at: call_time,
            clock_in_day: clock_in_day,
            creator: user
          )
        end

        context 'before call' do
          specify do
            expect(HoursAcceptancePeriod.count).to eq(1)
          end
        end

        specify 'should work' do
          response = post(url, params)
          expect(response.status).to eq(ok_status)
        end

        specify 'should not create conflicting hours acceptance period' do
          post(url, params)
          expect(HoursAcceptancePeriod.count).to eq(1)
        end
      end
    end
  end

  describe '#start_break' do
    let(:url) { url_helpers.start_break_api_v1_clocking_index_path }

    context 'when last event is a clock_in' do
      let(:params) do
        {
          staff_member_id: target_staff_member.id
        }
      end

      before do
        starts_at = day_start + 1.hour

        clock_in_day = ClockInDay.create!(
          staff_member: target_staff_member,
          venue: venue,
          date: date,
          creator: staff_member
        )

        ClockingActionHelper.create_initial_clock_in(
          clock_in_day: clock_in_day,
          creator: staff_member,
          at: starts_at
        )
      end

      context 'before call' do
        specify 'no clock outs should exist' do
          expect(ClockInEvent.count).to eq(1)
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
        expect(ClockInEvent.count).to eq(2)
        expect(ClockInEvent.last.event_type).to eq('start_break')
      end

      specify 'should not create extra period' do
        post(url, params)
        expect(ClockInPeriod.count).to eq(1)
      end

      specify 'should save event with period' do
        post(url, params)
        period = ClockInPeriod.last
        expect(
          period.clock_in_events.count
        ).to eq(2)

        expect(
          period.clock_in_events.last
        ).to eq(ClockInEvent.last)
      end

      specify 'no hours acceptance period should be created' do
        post(url, params)
        expect(HoursAcceptancePeriod.count).to eq(0)
      end
    end
  end

  describe '#end_break' do
    let(:url) { url_helpers.end_break_api_v1_clocking_index_path }
    let(:start_break_time) { day_start + 1.hour + 30.minutes }

    context 'when last event is a start_break' do
      let(:params) do
        {
          staff_member_id: target_staff_member.id
        }
      end

      before do
        starts_at = day_start + 1.hour

        clock_in_day = ClockInDay.create!(
          staff_member: target_staff_member,
          venue: venue,
          date: date,
          creator: staff_member
        )

        ClockingActionHelper.create_initial_clock_in(
          clock_in_day: clock_in_day,
          creator: staff_member,
          at: starts_at
        )

        last_clock_in_period = clock_in_day.clock_in_periods.last

        ClockingActionHelper.add_event_to_period(
          clock_in_period: last_clock_in_period,
          event_type: 'start_break',
          at: start_break_time,
          creator: staff_member
        )
      end

      context 'before call' do
        specify '2 events should exist' do
          expect(ClockInEvent.count).to eq(2)
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
        expect(ClockInEvent.count).to eq(3)
        expect(ClockInEvent.last.event_type).to eq('end_break')
      end

      specify 'should add event to period' do
        post(url, params)
        period = ClockInPeriod.last
        expect(period.clock_in_events.last).to eq(ClockInEvent.last)
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
        end_break_time = start_break_time + 3.hours
        travel_to end_break_time do
          historical_token = ApiAccessToken.new(
            expires_at: 30.minutes.from_now,
            api_key: api_key,
            staff_member: staff_member
          ).persist!
          set_authorization_header(historical_token.token)
          post(url, params)
        end
        set_authorization_header(access_token.token)

        _break = ClockInBreak.last
        expect(_break.starts_at).to eq(start_break_time)
        expect(_break.ends_at).to eq(end_break_time)
      end

      specify 'no hours acceptance period should be created' do
        post(url, params)
        expect(HoursAcceptancePeriod.count).to eq(0)
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

      specify 'no clock in day exists' do
        expect(ClockInDay.count).to eq(0)
      end
    end

    specify 'should create a clock in day' do
      post(url, params)
      expect(ClockInDay.count).to eq(1)
      day = ClockInDay.last
      expect(day.date).to eq(date)
      expect(day.staff_member).to eq(target_staff_member)
      expect(day.venue).to eq(venue)
    end

    specify 'should create a note and associate with day' do
      post(url, params)
      clock_in_day = ClockInDay.last
      created_note = ClockInNote.find_by(
        clock_in_day: clock_in_day
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
