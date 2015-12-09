FactoryGirl.define do
  factory :user do
    first_name 'Anna'
    surname 'Rennie'

    sequence :email do |n|
      "#{first_name.downcase}.#{surname.downcase}#{n}@example.com"
    end

    password "sdlksdsad"
    role 'staff'

    confirmed_at { 2.weeks.ago }

    trait :manager do
      role "manager"
    end

    trait :admin do
       role "admin"
    end
  end
end
