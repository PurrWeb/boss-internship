class PayslipDateValidator
  PAYSLIP_DATE_IN_PAST_UPDATE_VALIDATION_MESSAGE = "can't change holiday payslip date to be in the past"
  PAYSLIP_DATE_MISMATCH_VALIDATION_MESSAGE = 'Must mastch related finance report'
  def initialize(item:, now: Time.current)
    @item = item
    @now = now
  end
  attr_reader :item, :now

  def validate_all
    validate_finance_report_match
    validate_date_change
  end

  def validate_finance_report_match
    if item.finance_report.present? && item.payslip_date.present? && (RotaWeek.new(item.payslip_date).start_date != item.finance_report.week_start)
      item.errors.add(:payslip_date, PAYSLIP_DATE_MISMATCH_VALIDATION_MESSAGE)
    end
  end

  def validate_date_change
    payslip_date_moved_to_past = false
    if item.payslip_date_changed?
      current_rota_date = RotaShiftDate.to_rota_date(now)
      current_week = RotaWeek.new(current_rota_date)
      payslip_date_week = RotaWeek.new(item.payslip_date)
      payslip_date_moved_to_past = payslip_date_week.start_date < current_week.start_date
    end

    if payslip_date_moved_to_past
      item.errors.add(:payslip_date, PAYSLIP_DATE_IN_PAST_UPDATE_VALIDATION_MESSAGE)
    end
  end
end
