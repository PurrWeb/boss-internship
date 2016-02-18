FactoryGirl.define do
  factory :rota_status_transition do
    to_state :in_progress
    rota
    sort_key 10
    most_recent 1

    trait :in_progress do
    end

    trait :finished do
      to_state :finished
    end

    trait :published do
      to_state :published
    end
  end
end
