class FixBrokenFinanceReports < ActiveRecord::Migration
  def change
    ActiveRecord::Base.transaction do
      hours_acceptance_periods = HoursAcceptancePeriod.where(
        id: [235099, 235338, 236022, 236602, 237485, 235087, 236795, 237467, 235342, 235584, 235958, 235599, 236003, 235103, 235343, 235586, 237474, 237493, 235091, 235325, 235095, 237470, 237478, 235092, 237469, 237475, 237477, 234895, 235126, 235354, 236519, 237175, 235132, 235369, 235932, 236534, 237269, 234896, 235127, 235353, 236518, 237174, 236520, 237176, 235093, 237468, 237476, 237466, 235362, 235596, 235131, 235368, 235933, 236532, 237268, 236305, 237494, 237495, 235113, 235344, 235957, 235340, 235994, 237489, 237465, 237471, 237479, 235106, 235345, 235582, 237473, 235088, 235322, 235089, 235323, 235090, 235324]
      ).includes([:finance_report, clock_in_day: [:staff_member]])

      hours_acceptance_periods.each do |hours_acceptance_period|
        clock_in_day = hours_acceptance_period.clock_in_day
        staff_member = clock_in_day.staff_member
        correct_date = clock_in_day.date
        correct_week = RotaWeek.new(correct_date)
        existing_finance_report = hours_acceptance_period.finance_report
        if correct_week.start_date == existing_finance_report.week_start
          raise 'Attempt to patch valid finance report'
        end

        existing_finance_report.mark_requiring_update!

        new_finance_report = MarkFinanceReportRequiringUpdate.new(staff_member: staff_member, week:correct_week).call
        hours_acceptance_period.update_attributes!(finance_report: new_finance_report)
      end
    end
  end
end
