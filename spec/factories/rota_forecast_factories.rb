FactoryGirl.define do
  factory :rota_forecast do
    rota

    forecasted_take_cents 0
    total_cents 0
    staff_total_cents 0
    pr_total_cents 0
    kitchen_total_cents 0
    security_total_cents 0
  end
end
