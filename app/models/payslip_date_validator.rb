class PayslipDateValidator
  PAYSLIP_DATE_IN_PAST_UPDATE_VALIDATION_MESSAGE = "can't change holiday payslip date to be in the past"
  def initialize(item:, now: Time.current)
    @item = item
    @now = now
  end
  attr_reader :item, :now

  def validate
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
