class FixHapReportLinks < ActiveRecord::Migration
  # When finance reports changed to not be calcualted on the fly at 10:00 on the 16th of August 2018) there was an issue in db/migrate/20180910105605_fix_finance_report_links.rb which assigned the periods to the wrong finance report if they were accepted on a different week to their date (This is mostly an issue for hours done on sundays). Unfortunately this combined with the fact that many old reports were never completed means that there is no way to know from the data alone if any hours showed up in the wrong report and were paid. Values are stamped out on old reports and it's possible that the wrong values may have been introduced during the process of backfilling reports that were not completed at the time. The fact that already completed reports (right or wrong) are likely to match the companies records the best we can do at this point is to leave the value of these alone, link all hours to their correct reports and recalculate anything that has not already been completed.
  def change
    hours_acceptance_periods = HoursAcceptancePeriod.accepted.joins(:finance_report)

    dodgy_hours_acceptance_periods = hours_acceptance_periods.select do |hours_acceptance_period|
      week = RotaWeek.new(hours_acceptance_period.date)
      finance_report_week = RotaWeek.new(hours_acceptance_period.finance_report.week_start)
      finance_report_week.start_date != week.start_date
    end

    dodgy_hours_acceptance_periods.each do |hours_acceptance_period|
      current_finance_report = hours_acceptance_period.finance_report
      staff_member = hours_acceptance_period.staff_member
      correct_week = RotaWeek.new(hours_acceptance_period.date)

      correct_finance_report = FinanceReport.find_by!(
        staff_member: staff_member,
        week_start: correct_week.start_date
      )

      bug_introduction_time = DateTime.new(2018, 8, 16, 10, 00)

      current_finance_report_complete = current_finance_report.done?
      current_finance_report_completed_at = nil
      current_finance_report_completed_after_bug = false
      if current_finance_report_complete
        current_finance_report_completed_at = current_finance_report.send(:state_machine).history.last.updated_at
        current_finance_report_completed_after_bug = current_finance_report_completed_at > bug_introduction_time
      end

      correct_finance_report_complete =  correct_finance_report.done?
      correct_finance_report_completed_at = nil
      correct_finance_report_completed_after_bug = false
      if correct_finance_report_complete
        correct_finance_report_completed_at = correct_finance_report.send(:state_machine).history.last.updated_at
        correct_finance_report_completed_after_bug = correct_finance_report_completed_at  > bug_introduction_time
      end

      hours_acceptance_period.update_attribute(:finance_report_id, correct_finance_report.id)
      update_current_report = false
      update_correct_report = false

      #These are an issue as updating will cause a double hour to be saved
      if current_finance_report_complete && current_finance_report_completed_after_bug && correct_finance_report_complete && !correct_finance_report_completed_after_bug
        #Do nothing processing this report would result in messed up data
      elsif current_finance_report_complete && current_finance_report_completed_after_bug && !correct_finance_report_complete
        #Do nothing processing this report would result in messed up data
      else
        update_correct_report = !correct_finance_report_complete
        update_current_report = !current_finance_report_complete

        if update_current_report
          MarkFinanceReportRequiringUpdate.new(
            staff_member: staff_member,
            week: RotaWeek.new(current_finance_report.week_start)
          )
        end
        if update_correct_report
          MarkFinanceReportRequiringUpdate.new(
            staff_member: staff_member,
            week: correct_week
          )
        end
      end
    end
  end
end
