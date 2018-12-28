require 'rails_helper'

RSpec.describe GetNewYearHours do
  let(:now) { Time.current }
  let(:today) { now.to_date }
  let(:beginning_of_last_year) { (today - 1.year).beginning_of_year }
  let(:last_year) { beginning_of_last_year.year }
  let(:last_nye) { beginning_of_last_year.end_of_year }
  let(:beginning_of_last_nye) { RotaShiftDate.new(last_nye).start_time }
  let(:last_time_and_a_half_theshold_time) do
    DateTime.new(last_nye.year, last_nye.month, last_nye.day, 20, 0, 0)
  end
  let(:end_of_last_nye) { RotaShiftDate.new(last_nye).end_time }
  let(:service) { GetNewYearHours.new(year: last_year) }
  let(:result) { service.call }
  let(:call_service) { result }
  let(:master_venue) { FactoryGirl.create(:venue) }
  let(:other_venue) { FactoryGirl.create(:venue) }
  let(:user) { FactoryGirl.create(:user, :dev) }
  let(:staff_member) do
    FactoryGirl.create(
      :staff_member,
      master_venue: master_venue,
      work_venues: [other_venue],
    )
  end

  context 'staff member has accepted hours before deadline' do
    let(:clock_in_day) do
      ClockInDay.create!(
        date: last_nye,
        staff_member: staff_member,
        venue: master_venue,
        creator: user
      )
    end
    let(:hours_before_new_year_period_start_time) { beginning_of_last_nye }
    let(:hours_before_new_year_period_end_time) { beginning_of_last_nye + 4.hours }
    let(:finance_report) do
      FactoryGirl.create(
        :finance_report,
        venue: clock_in_day.venue,
        week_start: RotaWeek.new(clock_in_day.date).start_date,
        staff_member: staff_member,
      )
    end
    let(:hours_before_new_year_period) do
      HoursAcceptancePeriod.create!(
        clock_in_day: clock_in_day,
        starts_at: hours_before_new_year_period_start_time,
        ends_at: hours_before_new_year_period_end_time,
        creator: user,
        status: HoursAcceptancePeriod::ACCEPTED_STATE,
        accepted_at: hours_before_new_year_period_end_time + 5.minutes,
        accepted_by: user,
        finance_report: finance_report
      )
    end

    before do
      hours_before_new_year_period
    end

    specify do
      expect(result).to eq([])
    end
  end

  context 'staff member has accepted hours with breaks before deadline and during deadline' do
    let(:clock_in_day) do
      ClockInDay.create!(
        date: last_nye,
        staff_member: staff_member,
        venue: master_venue,
        creator: user
      )
    end
    let(:before_threshold_minutes) { 60 }
    let(:hours_start_time) { last_time_and_a_half_theshold_time - before_threshold_minutes.minutes }
    let(:hours_end_time) { hours_start_time + hours_duration_minutes.minutes }
    let(:hours_duration_minutes) { 240 }
    #amount of time break starts before threshold
    let(:break_overlap_minutes){ 30 }
    let(:break_start_time) { last_time_and_a_half_theshold_time - break_overlap_minutes.minutes }
    let(:break_end_time) { break_start_time + break_duration_minutes.minutes }
    let(:break_duration_minutes) { 90 }
    let(:hours_time_in_threshold_minutes) { hours_duration_minutes - before_threshold_minutes }
    let(:breaktime_in_theshold_minutes) { break_duration_minutes - break_overlap_minutes }
    let(:finance_report) do
      FactoryGirl.create(
        :finance_report,
        venue: clock_in_day.venue,
        week_start: RotaWeek.new(clock_in_day.date).start_date,
        staff_member: staff_member,
      )
    end
    let(:overlapping_period) do
      HoursAcceptancePeriod.create!(
        clock_in_day: clock_in_day,
        starts_at: hours_start_time,
        ends_at: hours_end_time,
        creator: user,
        status: HoursAcceptancePeriod::ACCEPTED_STATE,
        accepted_at: hours_end_time + 5.minutes,
        accepted_by: user,
        finance_report: finance_report,
      )
    end
    let(:overlapping_break) do
      HoursAcceptanceBreak.create!(
        hours_acceptance_period: overlapping_period,
        starts_at: break_start_time,
        ends_at: break_end_time,
      )
    end
    let(:expected_minutes_worked) { hours_time_in_threshold_minutes }
    let(:expected_payable_minutes_worked) { hours_time_in_threshold_minutes - breaktime_in_theshold_minutes }
    let(:expected_extra_minutes_required) { expected_payable_minutes_worked / 2 }
    let(:expected_start_time) { last_time_and_a_half_theshold_time }
    let(:expected_end_time) { hours_end_time }
    let(:expected_end_date) { last_nye }

    before do
      overlapping_period
      overlapping_break
    end

    specify do
      expect(result).to eq([{
        staff_member_id: staff_member.id,
        payable_minutes: expected_payable_minutes_worked,
        minutes_worked: expected_minutes_worked,
        break_minutes: breaktime_in_theshold_minutes,
        extra_minutes_required: expected_extra_minutes_required,
        owed_hour_description: "Time and a half hours for #{expected_payable_minutes_worked} minutes of work between #{expected_start_time.strftime('%H:%M')} and #{expected_end_time.strftime('%H:%M')} on #{expected_end_date.strftime('%d/%m/%Y')}",
      }])
    end
  end
end
