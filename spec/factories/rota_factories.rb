FactoryGirl.define do
  factory :rota do
    association :creator, factory: :user
    date { Time.now.to_date }
    venue
  end
end
