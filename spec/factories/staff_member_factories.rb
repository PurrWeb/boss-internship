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
    starts_at { 1.day.ago }

    employment_status_a false
    employment_status_b false
    employment_status_c false
    employment_status_d false

    address
    venue
    staff_type
    avatar { Rack::Test::UploadedFile.new(TestImageHelper.arnie_face_path) }
  end
end
