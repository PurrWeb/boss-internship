class RotaForecast < ActiveRecord::Base
  belongs_to :rota

  [:forecasted_take, :total, :staff_total, :pr_total, :kitchen_total, :security_total].each do |money_attribute|
    define_method("#{money_attribute}") do
      cents = public_send("#{money_attribute}_cents")
      if cents.present?
        Money.new(cents)
      else
        Money.new(0)
      end
    end

    define_method("#{money_attribute}=") do |val|
      public_send("#{money_attribute}_cents=", val.cents)
    end
  end

  [:total, :staff_total, :pr_total, :kitchen_total, :security_total].each do |total_method|
    define_method("#{total_method}_percentage") do
      if forecasted_take > Money.new(0)
        public_send(total_method) / forecasted_take * 100
      end
    end
  end
end
