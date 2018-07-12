class TrackTimeshiftsOnFinanceReports < ActiveRecord::Migration
  def change
    change_table :finance_reports do |t|
      t.boolean :contains_time_shifted_owed_hours
      t.boolean :contains_time_shifted_holidays
    end

    ActiveRecord::Base.transaction do
      FinanceReport.find_each do |finance_report|
        owed_hours = OwedHour.where(frozen_by_finance_report_id: finance_report.id)
        contains_time_shifted_owed_hours = owed_hours.any? do |owed_hour|
          payslip_week = RotaWeek.new(owed_hour.payslip_date)
          expected_payslip_week = RotaWeek.new(GetPayslipDate.new(item_date: owed_hour.date).call)
          payslip_week != expected_payslip_week
        end

        holidays = Holiday.where(frozen_by_finance_report_id: finance_report.id)
        contains_time_shifted_holidays = holidays.any? do |holiday|
          payslip_week = RotaWeek.new(holiday.payslip_date)
          expected_payslip_week = RotaWeek.new(GetPayslipDate.new(item_date: holiday.start_date).call)
          payslip_week != expected_payslip_week
        end

        finance_report.update!(
          contains_time_shifted_owed_hours: contains_time_shifted_owed_hours,
          contains_time_shifted_holidays: contains_time_shifted_holidays
        )
      end
    end

    change_column_null :finance_reports, :contains_time_shifted_owed_hours, false
    change_column_null :finance_reports, :contains_time_shifted_holidays, false
  end
end
