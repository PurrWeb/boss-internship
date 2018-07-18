class GetPayslipDate
  def initialize(item_date:)
    @item_date = item_date
  end
  attr_reader :item_date

  def call(now: Time.current)
    rota_date = RotaShiftDate.to_rota_date(now)
    current_week = RotaWeek.new(rota_date)

    if item_date > current_week.end_date
      item_payslip_week = RotaWeek.new(item_date)
      item_payslip_week.start_date
    else
      current_week.start_date
    end
  end
end
