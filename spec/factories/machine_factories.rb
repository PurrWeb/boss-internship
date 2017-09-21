FactoryGirl.define do
  factory :machine do
    venue
    association :created_by_user, factory: :user
    association :disabled_by, factory: :user
    name "Some name"
    location "Some where"
    float_cents 40000
    disabled_at nil
    initial_refill_x_10p 10000
    initial_cash_in_x_10p 10500
    initial_cash_out_x_10p 8000
  end
end
