FactoryGirl.define do
  factory :rota_forecast do
    rota

    forecasted_take Money.new(0)
    total Money.new(0)
    staff_total Money.new(0)
    pr_total Money.new(0)
    kitchen_total Money.new(0)
    security_total Money.new(0)
  end
end
