FactoryGirl.define do
  factory :invite do
    sequence :email do |n|
      "fake{n}@email.com"
    end

    role "admin"

    trait :admin do
      role "admin"
    end

    trait :manager do
      role "manager"
    end
  end
end
