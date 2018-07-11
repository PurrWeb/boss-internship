class GetPayslipDate
  def initialize(item_date:)
    @item_date = item_date
  end
  attr_reader :item_date

  def call(now: Time.current)
    rota_date = RotaShiftDate.to_rota_date(now)
    current_week = RotaWeek.new(rota_date)
    next_week = RotaWeek.new(rota_date + 1.week)

    if item_date > current_week.end_date
      item_payslip_week = RotaWeek.new(item_date + 1.week)
      item_payslip_week.start_date
    else
      next_week.start_date
    end
  end
end
