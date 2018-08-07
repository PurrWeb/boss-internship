require 'rails_helper'

describe DeleteHoursAcceptancePeriod do
  let(:now) { Time.current }
  let(:today) { RotaShiftDate.to_rota_date(now) }
  let(:start_of_day) { RotaShiftDate.new(today).start_time }
  let(:current_week) { RotaWeek.new(today) }
  let(:staff_member) { FactoryGirl.create(:staff_member, master_venue: venue) }
  let(:user) { FactoryGirl.create(:user) }
  let(:venue) { FactoryGirl.create(:venue) }
  let(:service) do
    DeleteHoursAcceptancePeriod.new(
      hours_acceptance_period: initial_hours_acceptance_period,
      requester: user
    )
  end
  let(:call_service) { result }
  let(:result) { service.call }
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

  context 'period is accepted' do
    let(:old_status) { HoursAcceptancePeriod::PENDING_STATE }
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
      initial_hours_acceptance_period
      initial_hours_acceptance_break
      existing_finance_report
      initial_hours_acceptance_period.update_attributes!(
        status: HoursAcceptancePeriod::ACCEPTED_STATE,
        accepted_by: user,
        accepted_at: now,
        finance_report: existing_finance_report
      )
    end

    context 'before call' do
      specify '1 period should exist' do
        expect(HoursAcceptancePeriod.count).to eq(1)
      end

      specify '1 break should exist' do
        expect(HoursAcceptanceBreak.count).to eq(1)
      end

      specify '1 finance reports should exist' do
        expect(FinanceReport.count).to eq(1)
        finance_report = FinanceReport.first
        expect(finance_report.ready?).to eq(true)
      end
    end

    context 'after call' do
      it 'should succeed' do
        call_service

        expect(result.success?).to eq(true)
      end

      it 'should mark report as deleted' do
        call_service

        expect(HoursAcceptancePeriod.count).to eq(1)
        hours_acceptance_period = HoursAcceptancePeriod.first
        expect(hours_acceptance_period.deleted?).to eq(true)
      end

      # Disabled currently is just used for disabling one break relative to other active breaks.
      # This works because .
      it 'should not mark breaks as disabled' do
        call_service

        expect(HoursAcceptanceBreak.count).to eq(1)
        hours_acceptance_break = HoursAcceptanceBreak.first
        expect(hours_acceptance_break.disabled?).to eq(false)
      end

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
