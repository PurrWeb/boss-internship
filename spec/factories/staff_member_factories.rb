FactoryGirl.define do
  factory :staff_member do
    pin_code '235340'
    name
    association :email_address, strategy: :build
    phone_number "1234-567890"
    gender 'female'
    date_of_birth DateTime.new(2000, 1, 1)

    address
    venue
  end
end
