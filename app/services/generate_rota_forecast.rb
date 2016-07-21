class GenerateRotaForecast
  def initialize(forecasted_take:, rota:)
    @forecasted_take = forecasted_take
    @rota = rota
  end

  def call
    RotaForecast.new(
      rota: rota,
      forecasted_take: forecasted_take,
      overhead_total: overhead_total,
      total: total,
      staff_total: staff_total,
      pr_total: pr_total,
      kitchen_total: kitchen_total,
      security_total: security_total
    )
  end

  private
  def total
    staff_total + pr_total + kitchen_total + security_total + overhead_total
  end

  def staff_total
    HourlyStaffCost.new(
      staff_members: RotaForecastStaffCategoryQuery.new.all,
      rota: rota
    ).total
  end

  def pr_total
    HourlyStaffCost.new(
      staff_members: RotaForecastPrsCategoryQuery.new.all,
      rota: rota
    ).total
  end

  def kitchen_total
    HourlyStaffCost.new(
      staff_members: RotaForecastKitchenCategoryQuery.new.all,
      rota: rota
    ).total
  end

  def security_total
    HourlyStaffCost.new(
      staff_members: RotaForecastSecurityCategoryQuery.new.all,
      rota: rota
    ).total
  end

  def overhead_total
    OverheadStaffCost.new(
      rota: rota
    ).total
  end

  private
  attr_reader :rota, :forecasted_take
end
