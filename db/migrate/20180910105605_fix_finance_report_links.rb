class FixFinanceReportLinks < ActiveRecord::Migration
  def change
    HoursAcceptancePeriod.accepted.find_each do |hours_acceptance_period|
      current_finance_report = hours_acceptance_period.finance_report
      finance_report_week = RotaWeek.new(current_finance_report.week_start)
      payslip_date = RotaShiftDate.to_rota_date(hours_acceptance_period.accepted_at)
      payslip_week = RotaWeek.new(payslip_date)
      if payslip_week.start_date != finance_report_week.start_date
          move_item(item: hours_acceptance_period, current_week: finance_report_week, new_week: payslip_week)
      end
    end
    OwedHour.find_each do |owed_hour|
      current_finance_report = owed_hour.finance_report
      finance_report_week = RotaWeek.new(current_finance_report.week_start)
      payslip_date = owed_hour.payslip_date
      payslip_week = RotaWeek.new(payslip_date)
      if payslip_week.start_date != finance_report_week.start_date
          move_item(item: owed_hour, current_week: finance_report_week, new_week: payslip_week)
      end
    end
    Holiday.find_each do |holiday|
      current_finance_report = holiday.finance_report
      finance_report_week = RotaWeek.new(current_finance_report.week_start)
      payslip_date = holiday.payslip_date
      payslip_week = RotaWeek.new(payslip_date)
      if payslip_week.start_date != finance_report_week.start_date
          move_item(item: holiday, current_week: finance_report_week, new_week: payslip_week)
      end
    end
    AccessoryRequest.find_each do |accessory_request|
      current_finance_report = accessory_request.finance_report
      finance_report_week = RotaWeek.new(current_finance_report.week_start)
      payslip_date = accessory_request.payslip_date
      payslip_week = RotaWeek.new(payslip_date)
      if payslip_week.start_date != finance_report_week.start_date
          move_item(item: accessory_request, current_week: finance_report_week, new_week: payslip_week)
      end
    end
    AccessoryRefundRequest.find_each do |accessory_refund_request|
      current_finance_report = accessory_refund_request.finance_report
      finance_report_week = RotaWeek.new(current_finance_report.week_start)
      payslip_date = accessory_refund_request.payslip_date
      payslip_week = RotaWeek.new(payslip_date)
      if payslip_week.start_date != finance_report_week.start_date
          move_item(item: accessory_refund_request, current_week: finance_report_week, new_week: payslip_week)
      end
    end
  end

  def move_item(item:, current_week:, new_week:)
    staff_member = item.staff_member
    new_finance_report = MarkFinanceReportRequiringUpdate.new(staff_member: staff_member, week: new_week).call
    item.update_attributes!(finance_report: new_finance_report)
    #update old report
    MarkFinanceReportRequiringUpdate.new(staff_member: staff_member, week: current_week).call
  end
end
