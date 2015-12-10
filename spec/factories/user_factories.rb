FactoryGirl.define do
  factory :user do
    name

    sequence :email do |n|
      "#{name.first_name.downcase}.#{name.surname.downcase}#{n}@example.com"
    end

    password "sdlksdsad"
    role 'manager'

    confirmed_at { 2.weeks.ago }

    # same as default but included allow explicit coding
    trait :manager do
      role "manager"
    end

    trait :admin do
       role "admin"
    end
  end
end
