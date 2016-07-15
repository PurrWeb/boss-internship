FactoryGirl.define do
  factory :holiday_transition do
    to_state :enabled
    holiday
    sort_key 10
    most_recent 1

    trait :disabled do
      to_state :disabled
    end
  end
end
