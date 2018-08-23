class FixBrokenFinanceReports < ActiveRecord::Migration
  def change
    ActiveRecord::Base.transaction do
      periods_updated = 0

      clock_in_days = ClockInDay.where('date > ?', Time.current - 2.months)

      HoursAcceptancePeriod.
        accepted.
        where('finance_report_id is not ?', nil).
        where(clock_in_day: clock_in_days).
        includes([:finance_report, clock_in_day: [:staff_member]]).each do |hours_acceptance_period|

        clock_in_day = hours_acceptance_period.clock_in_day
        staff_member = clock_in_day.staff_member
        correct_date = clock_in_day.date
        correct_week = RotaWeek.new(correct_date)
        existing_finance_report = hours_acceptance_period.finance_report

        next unless  correct_week.start_date == existing_finance_report.week_start

        existing_finance_report.mark_requiring_update!

        new_finance_report = MarkFinanceReportRequiringUpdate.new(staff_member: staff_member, week:correct_week).call
        hours_acceptance_period.update_attribute(:finance_report_id, new_finance_report.id)
        periods_updated = periods_updated + 1
      end
      puts "#{periods_updated} periods updated successfully"
    end
  end
end
