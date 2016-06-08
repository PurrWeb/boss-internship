FactoryGirl.define do
  factory :pay_rate do
    sequence(:name) { |n| "Pay Rate #{n}" }
    cents 1000
    calculation_type 'incremental_per_hour'
    pay_rate_type "named"

    trait :named do
    end

    trait :hourly do
    end

    trait :weekly do
      calculation_type 'salary_per_week'
    end
  end
end
