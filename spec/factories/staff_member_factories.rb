FactoryGirl.define do
  factory :staff_member do
    name

    sequence :email do |n|
      "#{name.first_name.downcase}.#{name.surname.downcase}#{n}@example.com"
    end

    phone_number "1234-567890"
    gender 'female'
    date_of_birth DateTime.new(2000, 1, 1)

    address
  end
end
