class WeeklyRotaForecast
  FIELDS = [:total, :staff_total, :pr_total, :kitchen_total, :security_total, :overhead_total]

  def initialize(week:, forecasted_take:, total:, overhead_total:, staff_total:, pr_total:, kitchen_total:, security_total:)
    @week = week
    @forecasted_take = forecasted_take
    @total = total
    @staff_total = staff_total
    @pr_total = pr_total
    @kitchen_total = kitchen_total
    @security_total = security_total
    @overhead_total = overhead_total
  end

  attr_reader :forecasted_take, :week
  attr_reader *FIELDS

  FIELDS.each do |total_method|
    define_method("#{total_method}_percentage") do
      if forecasted_take.present? && forecasted_take > Money.new(0)
        public_send(total_method) / forecasted_take * 100
      end
    end
  end
end
