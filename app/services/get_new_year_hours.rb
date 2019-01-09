# Generates data for time and a half hours on new years
class GetNewYearHours
  def initialize(year:)
    @year = year
  end
  attr_reader :year

  def call
    end_of_year_date = Date.new(year, 1, 1).end_of_year
    end_of_year_rota_date = RotaShiftDate.new(end_of_year_date)
    time_and_a_half_theshold_time = DateTime.new(end_of_year_date.year, end_of_year_date.month, end_of_year_date.day, 20, 0, 0)
    end_of_new_years_eve = end_of_year_rota_date.end_time

    all_hours_acceptance_periods = HoursAcceptancePeriod.accepted.enabled
    overlapping_hours_acceptance_periods = InRangeQuery.new(
      relation: all_hours_acceptance_periods,
      start_value: time_and_a_half_theshold_time,
      end_value: end_of_new_years_eve,
      start_column_name: 'starts_at',
      end_column_name: 'ends_at',
      include_boundaries: [:start]
    ).all

    hours_grouped_by_staff_member = {}
    overlapping_hours_acceptance_periods.find_each do |hours_acceptance_period|
      staff_member_id = hours_acceptance_period.staff_member.id
      if hours_grouped_by_staff_member[staff_member_id].nil?
        hours_grouped_by_staff_member[staff_member_id] = []
      end
      hours_grouped_by_staff_member[staff_member_id] << hours_acceptance_period
    end

    result = []
    hours_grouped_by_staff_member.each_pair do |staff_member_id, hours_acceptance_periods|
      total_overlaping_minutes_worked = 0
      total_payable_minutes_worked = 0
      total_overlapping_break_minutes = 0
      earliest_overlapping_minute = hours_acceptance_periods.first.ends_at + 10.years
      latest_overlapping_minute = hours_acceptance_periods.first.starts_at - 10.years
      date = nil

      hours_acceptance_periods.each do |hours_acceptance_period|
        effective_start_time = [time_and_a_half_theshold_time, hours_acceptance_period.starts_at].max
        effective_end_time = [end_of_new_years_eve, hours_acceptance_period.ends_at].min

        enabled_breaks = hours_acceptance_period.hours_acceptance_breaks_enabled

        overlaping_minutes_worked = (effective_end_time - effective_start_time).to_i / 60
        overlapping_break_minutes = enabled_breaks.inject(0) do |sum, _break|
          effective_break_start = [time_and_a_half_theshold_time, _break.starts_at].max
          effective_break_end = [time_and_a_half_theshold_time, _break.ends_at].max

          sum + [(effective_break_end - effective_break_start).to_i / 60, 0].max
        end

        overlapping_payable_minutes_worked = overlaping_minutes_worked - overlapping_break_minutes

        total_overlaping_minutes_worked = total_overlaping_minutes_worked + overlaping_minutes_worked
        total_overlapping_break_minutes = total_overlapping_break_minutes + overlapping_break_minutes
        total_payable_minutes_worked = total_payable_minutes_worked + overlapping_payable_minutes_worked
        earliest_overlapping_minute = [earliest_overlapping_minute, effective_start_time].min
        latest_overlapping_minute = [latest_overlapping_minute, effective_end_time].max
        date = hours_acceptance_period.date
      end

      extra_minutes_required = total_payable_minutes_worked / 2

      description = "Time and a half hours for #{total_payable_minutes_worked} minutes of work between #{earliest_overlapping_minute.strftime('%H:%M')} and #{latest_overlapping_minute.strftime('%H:%M')} on #{date.strftime('%d/%m/%Y')}"

      result << {
        staff_member_id: staff_member_id,
        date: end_of_year_date,
        payable_minutes: total_payable_minutes_worked,
        minutes_worked: total_overlaping_minutes_worked,
        break_minutes: total_overlapping_break_minutes,
        extra_minutes_required: extra_minutes_required,
        owed_hour_description: description,
      }
    end
    result
  end
end
