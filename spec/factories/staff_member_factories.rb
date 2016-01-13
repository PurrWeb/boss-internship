require_relative '../support/test_image_helper'

FactoryGirl.define do
  factory :staff_member do
    pin_code '235340'
    name
    association :email_address, strategy: :build
    phone_number "1234-567890"
    gender 'female'
    date_of_birth DateTime.new(2000, 1, 1)
    national_insurance_number 'GM-12-45-34-A'
    creator factory: :user

    address
    venue
    staff_type
    avatar { Rack::Test::UploadedFile.new(TestImageHelper.arnie_face_path) }
  end
end
