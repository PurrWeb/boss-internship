require 'rails_helper'
require 'feature/support/clocking_action_helper'

RSpec.describe 'Hours acceptance endpoints' do
  include Rack::Test::Methods
  include HeaderHelpers
  include ActiveSupport::Testing::TimeHelpers

  let(:venue) { FactoryGirl.create(:venue) }
  let(:user) { FactoryGirl.create(:user, venues: [venue]) }
  let(:another_user) { FactoryGirl.create(:user, venues: [venue]) }
  let(:staff_member) { FactoryGirl.create(:staff_member, master_venue: venue) }
  let(:date) { Time.current.to_date }
  let(:start_of_day) { RotaShiftDate.new(date).start_time }
  let(:api_key) do
    ApiKey.create!(venue: venue, user: user, key_type: ApiKey::BOSS_KEY_TYPE)
  end
  let(:access_token) do
    WebApiAccessToken.new(
      expires_at: 30.minutes.from_now,
      user: user
    ).persist!
  end

  let(:another_user_access_token) do
    WebApiAccessToken.new(
      expires_at: 30.minutes.from_now,
      user: another_user
    ).persist!
  end

  before do
    set_authorization_header(access_token.token)
  end

  describe 'create' do
    let(:url) { url_helpers.api_v1_hours_acceptance_periods_path }
    let(:start_of_shift) { start_of_day }
    let(:end_of_shift) { start_of_day + 10.hours }
    let(:break1_start) { start_of_day + 30.minutes }
    let(:break1_end) { start_of_day + 1.hour }
    let(:break2_start) { start_of_day + 4.hours }
    let(:break2_end) { start_of_day + 5.hours }
    let(:params) do
      {
        venueId: venue.id,
        date: date,
        staffMember: staff_member.id,
        startsAt: start_of_shift,
        endsAt: end_of_shift,
        breaks: [
          {
            startsAt: break1_start,
            endsAt: break1_end
          },
          {
            startsAt: break2_start,
            endsAt: break2_end
          }
        ],
        status: 'accepted'
      }
    end

    specify do
      response = post(url, params)
      expect(response.status).to eq(ok_status)
    end

    context 'when no hours confirmation exists' do
      context 'before call' do
        specify 'no hours acceptance periods exist' do
          expect(HoursAcceptancePeriod.count).to eq(0)
        end

        specify 'no clock in day exists' do
          expect(ClockInDay.count).to eq(0)
        end
      end

      specify 'creates a new hours acceptance period' do
        post(url, params)
        expect(HoursAcceptancePeriod.count).to eq(1)
        hours_acceptance_period = HoursAcceptancePeriod.last
        expect(hours_acceptance_period.starts_at).to eq(start_of_shift)
        expect(hours_acceptance_period.ends_at).to eq(end_of_shift)
        expect(hours_acceptance_period.status).to eq('accepted')
      end

      specify '2 HoursAcceptanceBreaks are created' do
        post(url, params)
        expect(HoursAcceptanceBreak.count).to eq(2)
        break1 = HoursAcceptanceBreak.all[0]
        break2 = HoursAcceptanceBreak.all[1]
        expect(break1.starts_at).to eq(break1_start)
        expect(break1.ends_at).to eq(break1_end)
        expect(break2.starts_at).to eq(break2_start)
        expect(break2.ends_at).to eq(break2_end)
      end

      specify 'should create a clock in day' do
        post(url, params)
        expect(ClockInDay.count).to eq(1)
      end
    end

    context 'when a clock in day exists' do
      let(:clock_in_day) do
        ClockInDay.create!(
          date: date,
          staff_member: staff_member,
          venue: venue,
          creator: staff_member
        )
      end

      before do
        clock_in_day
      end

      context 'before call' do
        specify 'a clock in day should exist' do
          expect(ClockInDay.count).to eq(1)
        end

        specify 'no clock in periods exist' do
          expect(HoursAcceptancePeriod.count).to eq(0)
        end
      end

      specify 'does not create new clock in day' do
        post(url, params)
        expect(ClockInDay.count).to eq(1)
      end

      context 'staff member is not clocked out' do
        before do
          period = ClockInPeriod.create!(
            starts_at: start_of_day,
            clock_in_day: clock_in_day,
            creator: user
          )

          ClockInEvent.create!(
            at: start_of_day,
            clock_in_period: period,
            event_type: 'clock_in',
            creator: user
          )
        end

        specify 'request should be rejected' do
          response = post(url, params)

          expect(
            response.status
          ).to eq(
            access_denied_status
          )
        end
      end
    end
  end

  describe 'update' do
    let(:url) { url_helpers.api_v1_hours_acceptance_period_path(id: hours_acceptance_period) }
    let(:start_of_shift) { start_of_day }
    let(:end_of_shift) { start_of_day + 10.hours }
    let(:clock_in_day) do
      ClockInDay.create!(
        date: date,
        staff_member: staff_member,
        venue: venue,
        creator: staff_member
      )
    end
    let(:hours_acceptance_period) do
      HoursAcceptancePeriod.create!(
        creator: staff_member,
        starts_at: start_of_shift,
        ends_at: end_of_shift,
        clock_in_day: clock_in_day
      )
    end
    let(:new_status) { 'accepted' }
    let(:update_shift_hours) { 1.hour }
    let(:new_start_of_shift) { start_of_shift + update_shift_hours }
    let(:new_end_of_shift) { end_of_shift + update_shift_hours }
    let(:params) do
      {
        startsAt: new_start_of_shift,
        endsAt: new_end_of_shift,
        status: new_status
      }
    end

    before do
      hours_acceptance_period
    end

    context 'before call' do
      specify 'period should have 1 version' do
        expect(hours_acceptance_period.versions.count).to eq(1)
      end
    end

    specify 'should work' do
      result = patch(url, params)
      expect(result.status).to eq(ok_status)
    end

    specify 'should update period' do
      patch(url, params)
      hours_acceptance_period.reload
      expect(hours_acceptance_period.starts_at).to eq(new_start_of_shift)
      expect(hours_acceptance_period.ends_at).to eq(new_end_of_shift)
      expect(hours_acceptance_period.reload.status).to eq('accepted')
    end

    specify 'should update period' do
      patch(url, params)
      hours_acceptance_period.reload
      expect(hours_acceptance_period.starts_at).to eq(new_start_of_shift)
      expect(hours_acceptance_period.ends_at).to eq(new_end_of_shift)
      expect(hours_acceptance_period.reload.status).to eq('accepted')
    end

    context ' acceptance' do
      let(:new_params) do
        params.merge({status: 'pending'})
      end

      it ' should be accepted, accepted_by and accepted_at by user' do
        call_time = start_of_day + 5.hours
        travel_to call_time do
          patch(url, params)
        end
        hours_acceptance_period.reload
        expect(hours_acceptance_period.status).to eq('accepted')
        expect(hours_acceptance_period.accepted_by).to eq(user)
        expect(hours_acceptance_period.accepted_at).to eq(call_time)
      end

      it ' accepted, accepted_by and accepted_at should be cleared when unaccept' do
        patch(url, new_params)
        hours_acceptance_period.reload
        expect(hours_acceptance_period.status).to eq('pending')
        expect(hours_acceptance_period.accepted_by).to be_nil
        expect(hours_acceptance_period.accepted_at).to be_nil
      end

      it ' when another user accept, accepted by should be same user' do
        set_authorization_header(another_user_access_token.token)
        call_time = Time.current.round
        travel_to call_time do
          patch(url, params)
        end

        hours_acceptance_period.reload
        expect(hours_acceptance_period.status).to eq('accepted')
        expect(hours_acceptance_period.accepted_by).not_to eq(user)
        expect(hours_acceptance_period.accepted_by).to eq(another_user)
        expect(hours_acceptance_period.accepted_at).to eq(call_time)
        expect(hours_acceptance_period.updated_at).to eq(call_time)
      end
    end

    specify 'should update period version data' do
      patch(url, params)
      hours_acceptance_period.reload
      expect(hours_acceptance_period.versions.count).to eq(2)
      expect(hours_acceptance_period.versions.last.whodunnit).to eq(user.whodunnit_data.to_s)
    end

    context 'when period is frozen' do
      let(:finance_report) do
        FactoryGirl.create(:finance_report).tap do |finance_report|
          finance_report.mark_ready!
          finance_report.allow_mark_completed = true
          finance_report.mark_completed!
        end
      end

      let(:hours_acceptance_period) do
        HoursAcceptancePeriod.create!(
          creator: staff_member,
          starts_at: start_of_shift,
          ends_at: end_of_shift,
          clock_in_day: clock_in_day,
          finance_report: finance_report
        )
      end

      specify 'should work' do
        result = patch(url, params)
        expect(result.status).to eq(unprocessable_entity_status)
      end

      specify 'should work' do
        response = patch(url, params)
        json = JSON.parse(response.body)
        expect(json.fetch("errors").fetch("base")).to eq(['these hours are not editable'])
      end
    end

    context 'when breaks exist' do
      let(:break1_start) { start_of_shift + 10.minutes }
      let(:break1_end) { start_of_shift + 10.minutes + 1.hour }
      let(:break1) do
        HoursAcceptanceBreak.create!(
          hours_acceptance_period: hours_acceptance_period,
          starts_at: break1_start,
          ends_at: break1_end
        )
      end

      let(:break2_start) { start_of_shift + 3.hours }
      let(:break2_end) { start_of_shift + 4.hours }
      let(:break2) do
        HoursAcceptanceBreak.create!(
          hours_acceptance_period: hours_acceptance_period,
          starts_at: break2_start,
          ends_at: break2_end
        )
      end

      before do
        break1
        break2
      end

      context 'updating one break' do
        let(:update_break_id) { break1.id }
        let(:update_break_start) { break2_start + update_shift_hours }
        let(:update_break_end) { break2_end + update_shift_hours }
        let(:new_break_start) { break1_start + update_shift_hours }
        let(:new_break_end) { break1_end + update_shift_hours }
        let(:params) do
          {
            startsAt: new_start_of_shift,
            endsAt: new_end_of_shift,
            status: new_status,
            breaks: [
              {
                id: update_break_id,
                startsAt: update_break_start,
                endsAt: update_break_end
              },
              {
                startsAt: new_break_start,
                endsAt: new_break_end
              }
            ]
          }
        end

        context 'before call' do
          specify 'period has 2 breaks' do
            expect(
              hours_acceptance_period.hours_acceptance_breaks.enabled.count
            ).to eq(2)
          end
        end

        specify 'should work' do
          result = patch(url, params)
          expect(result.status).to eq(ok_status)
        end

        specify 'should disable break2' do
          patch(url, params)
          expect(
            break2.reload
          ).to be_disabled
        end

        specify 'should update break1' do
          expect(break1.versions.count).to eq(1)

          patch(url, params)
          break1.reload
          expect(
            hours_acceptance_period.hours_acceptance_breaks.enabled
          ).to include(break1)
          expect(break1.versions.count).to eq(2)
          expect(break1.starts_at).to eq(update_break_start)
          expect(break1.ends_at).to eq(update_break_end)
        end

        specify 'should create new break' do
          patch(url, params)
          new_break = hours_acceptance_period.
            hours_acceptance_breaks.
            enabled.
            where('id NOT IN (?)', [break1.id, break2.id]).
          first

          expect(new_break).to be_present
          expect(new_break.starts_at).to eq(new_break_start)
          expect(new_break.ends_at).to eq(new_break_end)
        end
      end

      context 'attempting to add overlapping break' do
        let(:params) do
          {
            startsAt: new_start_of_shift,
            endsAt: new_end_of_shift,
            status: new_status,
            breaks: [
              {
                id: break1.id,
                startsAt: break1.starts_at + update_shift_hours,
                endsAt: break1.ends_at + update_shift_hours
              },
              {
                id: break2.id,
                startsAt: break2.starts_at + update_shift_hours,
                endsAt: break2.ends_at + update_shift_hours
              },
              {
                startsAt: break1.starts_at + update_shift_hours,
                endsAt: break1.ends_at + update_shift_hours
              }
            ]
          }
        end

        specify 'should return unprocessable_entity_status' do
          result = patch(url, params)
          expect(result.status).to eq(unprocessable_entity_status)
        end

        specify 'should return errors for the object in question' do
          response = patch(url, params)
          json = JSON.parse(response.body)

          expect(json).to eq(
            {
              "errors"=> {
                "breaks"=> [
                  {},
                  {},
                  {
                    "startsAt" => [""],
                    "endsAt" => [""],
                    "base" => ["break overlaps existing break"]
                  }
                ]
              }
            }
          )
        end
      end

      context 'staff member is not clocked out' do
        before do
          period = ClockInPeriod.create!(
            starts_at: start_of_day,
            clock_in_day: clock_in_day,
            creator: user
          )

          ClockInEvent.create!(
            at: start_of_day,
            clock_in_period: period,
            event_type: 'clock_in',
            creator: user
          )
        end

        specify 'request should be rejected' do
          response = patch(url, params)

          expect(
            response.status
          ).to eq(
            access_denied_status
          )
        end
      end
    end
  end

  describe 'destroy' do
    let(:url) { url_helpers.api_v1_hours_acceptance_period_path(id: hours_acceptance_period) }
    let(:clock_in_day) do
      ClockInDay.create!(
        date: date,
        staff_member: staff_member,
        venue: venue,
        creator: staff_member
      )
    end
    let(:start_of_shift) { start_of_day + 1.hour }
    let(:end_of_shift) { start_of_day + 2.hours }
    let(:hours_acceptance_period) do
      HoursAcceptancePeriod.create!(
        creator: staff_member,
        starts_at: start_of_shift,
        ends_at: end_of_shift,
        clock_in_day: clock_in_day
      )
    end
    let(:params) do
      {}
    end

    specify 'should be success' do
      result = delete(url, params)
      expect(result.status).to eq(ok_status)
    end

    specify 'period is deleted' do
      delete(url, params)
      expect(hours_acceptance_period.reload).to be_deleted
    end

    context 'staff member is not clocked out' do
      before do
        period = ClockInPeriod.create!(
          starts_at: start_of_day,
          clock_in_day: clock_in_day,
          creator: user
        )

        ClockInEvent.create!(
          at: start_of_day,
          clock_in_period: period,
          event_type: 'clock_in',
          creator: user
        )
      end

      specify 'request should be rejected' do
        response = delete(url, params)

        expect(
          response.status
        ).to eq(
          access_denied_status
        )
      end
    end
  end

  describe '#clock_out' do
    let(:url) { url_helpers.clock_out_api_v1_hours_acceptance_periods_path }
    let(:params) do
      {
        staffMember: staff_member.id,
        date: date,
        venueId: venue.id
      }
    end
    let(:clock_in_day) do
      ClockInDay.create!(
        staff_member: staff_member,
        venue: venue,
        date: date,
        creator: user
      )
    end

    before do
      clock_in_day
      ClockingActionHelper.create_initial_clock_in(
        clock_in_day: clock_in_day,
        creator: user,
        at: start_of_day
      )
    end

    specify 'should be success' do
      result = post(url, params)
      expect(result.status).to eq(ok_status)
    end

    specify 'should set event to call time' do
      call_time = start_of_day + 1.hour
      travel_to call_time do
        post(url, params)
      end

      event = ClockInEvent.last
      expect(event.event_type).to eq('clock_out')
      expect(event.at).to eq(call_time)
    end

    specify 'return clock in day json' do
      response = nil

      call_time = start_of_day + 1.hour
      travel_to call_time do
       response = post(url, params)
      end

      json = JSON.parse(response.body)
      ["clockInPeriod", "clockInBreaks", "hoursAcceptancePeriod", "hoursAcceptanceBreaks"].each do |key|
        expect(json.keys).to include(key)
      end
    end
  end

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

  def access_denied_status
    500
  end
end
