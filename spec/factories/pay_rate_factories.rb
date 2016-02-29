FactoryGirl.define do
  factory :pay_rate do
    sequence(:name) { |n| "Pay Rate #{n}" }
    description "A factory generated pay rate"
    cents_per_hour 1000
    pay_rate_type "named"

    trait :named do
    end
  end
end
