require 'rails_helper'

describe UpdateHoursAcceptancePeriod do

  let(:now) { Time.current }
  let(:today) { RotaShiftDate.to_rota_date(now) }
  let(:start_of_day) { RotaShiftDate.new(today).start_time }
  let(:current_week) { RotaWeek.new(today) }
  let(:staff_member) { FactoryGirl.create(:staff_member, master_venue: venue) }
  let(:user) { FactoryGirl.create(:user) }
  let(:venue) { FactoryGirl.create(:venue) }
  let(:service) do
    UpdateHoursAcceptancePeriod.new(
      hours_acceptance_period: initial_hours_acceptance_period,
      starts_at: new_starts_at,
      ends_at: new_ends_at,
      status: new_status,
      breaks_data: new_breaks_data,
      reason_note: new_reason_note,
      requester: requester
    )
  end
  let(:call_service) { result }
  let(:result) { service.call(call_time: now) }
  let(:clock_in_day) do
    ClockInDay.create!(
      staff_member: staff_member,
      date: today,
      venue: venue,
      creator: user
    )
  end
  let(:shift_duration_hours) { 8 }
  let(:old_starts_at) { start_of_day }
  let(:old_ends_at) { start_of_day + shift_duration_hours.hours }
  let(:old_break_starts_at) { start_of_day + 2.hours }
  let(:old_break_ends_at) { old_break_starts_at + 1.hour }
  let(:old_reason_note) { 'old_reason_note' }
  let(:requester) { user }
  let(:initial_hours_acceptance_period) do
    HoursAcceptancePeriod.create!(
      creator: user,
      clock_in_day: clock_in_day,
      starts_at: old_starts_at,
      ends_at: old_ends_at,
      status: old_status,
      reason_note: old_reason_note
    )
  end
  let(:initial_hours_acceptance_break) do
    HoursAcceptanceBreak.create!(
      hours_acceptance_period: initial_hours_acceptance_period,
      starts_at: old_break_starts_at,
      ends_at: old_break_ends_at
    )
  end

  let(:new_starts_at) { start_of_day + 8.hours }
  let(:new_ends_at) { new_starts_at + 8.hours }
  let(:new_break1_starts_at) { new_starts_at + 1.hour }
  let(:new_break1_ends_at) { new_break1_starts_at + 30.minutes}
  let(:new_break2_starts_at) { new_starts_at + 3.hours }
  let(:new_break2_ends_at) { new_break2_starts_at + 30.minutes }
  let(:new_status) { HoursAcceptancePeriod::ACCEPTED_STATE }
  let(:new_reason_note) { 'new_reason_note' }
  let(:new_breaks_data) do
    [
      {
        startsAt: new_break1_starts_at,
        endsAt: new_break1_ends_at
      },
      {
        startsAt: new_break2_starts_at,
        endsAt: new_break2_ends_at
      }
    ]
  end

  before do
    initial_hours_acceptance_period
    initial_hours_acceptance_break
  end

  describe 'accepting period' do
    let(:old_status) { HoursAcceptancePeriod::PENDING_STATE}
    let(:new_status) { HoursAcceptancePeriod::ACCEPTED_STATE }

    context 'before call' do
      specify '1 period should exist' do
        expect(HoursAcceptancePeriod.count).to eq(1)
      end

      specify '1 break should exist' do
        expect(HoursAcceptanceBreak.count).to eq(1)
      end

      specify 'no finance reports should exist' do
        expect(FinanceReport.count).to eq(0)
      end
    end

    context 'no finance report exists' do
      it 'should succeed' do
        call_service
        expect(result.success?).to eq(true)
      end

      it 'should update the values' do
        call_service
        expect(HoursAcceptancePeriod.count).to eq(1)
        expect(result.hours_acceptance_period).to eq(initial_hours_acceptance_period)

        hours_acceptance_period = result.hours_acceptance_period
        expect(hours_acceptance_period.starts_at).to eq(new_starts_at)
        expect(hours_acceptance_period.ends_at).to eq(new_ends_at)
        expect(hours_acceptance_period.status).to eq(new_status)
        expect(hours_acceptance_period.reason_note).to eq(new_reason_note)
        expect(hours_acceptance_period.hours_acceptance_breaks.count).to eq(3)
        expect(hours_acceptance_period.hours_acceptance_breaks_enabled.count).to eq(2)
        hours_acceptance_breaks = hours_acceptance_period.hours_acceptance_breaks_enabled
        first_break = hours_acceptance_breaks.first
        expect(first_break.starts_at).to eq(new_break1_starts_at)
        expect(first_break.ends_at).to eq(new_break1_ends_at)
        last_break = hours_acceptance_breaks.last
        expect(last_break.starts_at).to eq(new_break2_starts_at)
        expect(last_break.ends_at).to eq(new_break2_ends_at)
      end

      it 'should create finance report' do
        call_service

        expect(FinanceReport.count).to eq(1)
        finance_report = FinanceReport.first
        expect(finance_report.staff_member).to eq(staff_member)
        expect(finance_report.venue).to eq(staff_member.master_venue)
        expect(finance_report.week_start).to eq(current_week.start_date)
        expect(finance_report.requiring_update?).to eq(true)

        initial_hours_acceptance_period.reload
        expect(initial_hours_acceptance_period.finance_report).to eq(finance_report)
      end

      context 'finance report exists' do
        let(:existing_finance_report) do
          FactoryGirl.create(
            :finance_report,
            staff_member: staff_member,
            venue: staff_member.master_venue,
            week_start: current_week.start_date
          ).tap do |report|
            report.mark_ready!
          end
        end

        before do
          existing_finance_report
        end

        context 'before call' do
          specify 'finance report should exist' do
            expect(FinanceReport.count).to eq(1)
            finance_report = FinanceReport.first
            expect(finance_report.ready?).to eq(true)
          end
        end

        context 'after call' do
          it 'should mark finance report for update' do
            call_service

            expect(FinanceReport.count).to eq(1)
            finance_report = FinanceReport.first
            expect(finance_report.requiring_update?).to eq(true)

            initial_hours_acceptance_period.reload
            expect(initial_hours_acceptance_period.finance_report).to eq(finance_report)
          end
        end
      end
    end

    describe 'unaccepting period' do
      let(:old_status) { HoursAcceptancePeriod::ACCEPTED_STATE }
      let(:new_status) { HoursAcceptancePeriod::PENDING_STATE}
      let(:initial_hours_acceptance_period) do
        HoursAcceptancePeriod.create!(
          creator: user,
          clock_in_day: clock_in_day,
          starts_at: old_starts_at,
          ends_at: old_ends_at,
          status: old_status,
          reason_note: old_reason_note,
          accepted_by: user,
          accepted_at: now - 2.hours,
          finance_report: existing_finance_report
        )
      end

      context 'finance report exists' do
        let(:existing_finance_report) do
          FactoryGirl.create(
            :finance_report,
            staff_member: staff_member,
            venue: staff_member.master_venue,
            week_start: current_week.start_date
          ).tap do |report|
            report.mark_ready!
          end
        end

        context 'before call' do
          specify 'finance report should exist' do
            expect(FinanceReport.count).to eq(1)
            finance_report = FinanceReport.first
            expect(finance_report.ready?).to eq(true)
            expect(initial_hours_acceptance_period.finance_report).to eq(finance_report)
          end
        end

        context 'after call' do
          it 'should mark finance report for update' do
            call_service

            expect(FinanceReport.count).to eq(1)
            finance_report = FinanceReport.first
            expect(finance_report.requiring_update?).to eq(true)

            initial_hours_acceptance_period.reload
            expect(initial_hours_acceptance_period.finance_report).to eq(nil)
          end
        end
      end
    end
  end
end
