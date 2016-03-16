FactoryGirl.define do
  factory :user_transition do
    to_state :enabled
    user
    sort_key 10
    most_recent 1

    trait :disabled do
      to_state :disabled
    end
  end
end
