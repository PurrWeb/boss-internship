FactoryGirl.define do
  factory :staff_member_transition do
    to_state :enabled
    staff_member
    sort_key 10
    most_recent 1

    trait :disabled do
      to_state :disabled
    end
  end
end
