FactoryGirl.define do
  factory :invite do
    sequence :email do |n|
      "fake#{n}@email.com"
    end

    role "admin"

    trait :admin do
      role "admin"
    end

    trait :manager do
      role "manager"
    end

    trait :accepted do
      after(:create) do |invite|
        FactoryGirl.create(:invite_transition, :accepted, invite: invite)
      end
    end
  end
end
