FactoryGirl.define do
  factory :invite_transition do
    to_state :open
    invite
    sort_key 10
    most_recent false

    trait :accepted do
      to_state :accepted
    end

    trait :revoked do
      to_state :revoked
    end
  end
end
