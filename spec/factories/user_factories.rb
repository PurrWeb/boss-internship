FactoryGirl.define do
  factory :user do
    first_name 'Anna'
    sir_name 'Rennie'

    sequence :email do |n|
      "#{first_name.downcase}.#{sir_name.downcase}#{n}@example.com"
    end

    password "999999999"
    phone_number "1234-567890"
    gender 'female'
    date_of_birth DateTime.new(2000, 1, 1)

    address

    confirmed_at { 2.weeks.ago }

    trait :admin do
       role "admin"
    end
  end
end
