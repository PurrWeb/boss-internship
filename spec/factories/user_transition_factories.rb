FactoryGirl.define do
  factory :user_transition do
    transient do
      requester { FactoryGirl.create(:user) }
    end

    to_state :enabled
    user
    sort_key 10
    most_recent 1
    metadata do
      { requster_user_id: requester.id }
    end

    trait :disabled do
      to_state :disabled
    end
  end
end
