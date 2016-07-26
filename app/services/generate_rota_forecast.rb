class GenerateRotaForecast
  def initialize(forecasted_take_cents:, rota:)
    @forecasted_take_cents = forecasted_take_cents
    @rota = rota
  end

  def call
    RotaForecast.new(
      rota: rota,
      forecasted_take_cents: forecasted_take_cents,
      overhead_total_cents: overhead_total_cents,
      total_cents: total_cents,
      staff_total_cents: staff_total_cents,
      pr_total_cents: pr_total_cents,
      kitchen_total_cents: kitchen_total_cents,
      security_total_cents: security_total_cents
    )
  end

  private
  def total_cents
    staff_total_cents +
      pr_total_cents +
      kitchen_total_cents +
      security_total_cents +
      overhead_total_cents
  end

  def staff_total_cents
    HourlyStaffCost.new(
      staff_members: RotaForecastStaffCategoryQuery.new.all,
      rota: rota
    ).total_cents
  end

  def pr_total_cents
    HourlyStaffCost.new(
      staff_members: RotaForecastPrsCategoryQuery.new.all,
      rota: rota
    ).total_cents
  end

  def kitchen_total_cents
    HourlyStaffCost.new(
      staff_members: RotaForecastKitchenCategoryQuery.new.all,
      rota: rota
    ).total_cents
  end

  def security_total_cents
    HourlyStaffCost.new(
      staff_members: RotaForecastSecurityCategoryQuery.new.all,
      rota: rota
    ).total_cents
  end

  def overhead_total_cents
    OverheadStaffCost.new(
      rota: rota
    ).total_cents
  end

  private
  attr_reader :rota, :forecasted_take_cents
end
