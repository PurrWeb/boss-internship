FactoryGirl.define do
  factory :rota do
    association :creator, factory: :user
    date { Time.now.to_date }
    venue

    trait :finished do
      after(:create) do |rota|
        FactoryGirl.create(:rota_status_transition, :finished, rota: rota)
      end
    end
  end
end
