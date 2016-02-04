FactoryGirl.define do
  factory :rota_status_transition do
    to_state :open
    rota
    sort_key 10
    most_recent 1

    trait :finished do
      to_state :finished
    end
  end
end
