class CompositeRotaForecast
  FIELDS = [:total, :staff_total, :pr_total, :kitchen_total, :security_total, :overhead_total]

  def initialize(week_start:, venue:, forecasted_take_cents:, total_cents:, overhead_total_cents:, staff_total_cents:, pr_total_cents:, kitchen_total_cents:, security_total_cents:)
    @week_start = week_start
    @venue = venue
    @forecasted_take_cents = forecasted_take_cents
    @total_cents = total_cents
    @staff_total_cents = staff_total_cents
    @pr_total_cents = pr_total_cents
    @kitchen_total_cents = kitchen_total_cents
    @security_total_cents = security_total_cents
    @overhead_total_cents = overhead_total_cents
  end

  attr_reader :forecasted_take_cents, :venue, :week_start

  FIELDS.each do |total_method|
    define_method("#{total_method}_cents") do
      instance_variable_get("@#{total_method}_cents")
    end

    define_method("#{total_method}_percentage") do
      if forecasted_take_cents.present? && forecasted_take_cents > 0
        (public_send("#{total_method}_cents") / 100.0) /
          (forecasted_take_cents / 100.0) * 100
      end
    end
  end
end
