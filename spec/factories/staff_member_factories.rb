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

    pay_rate

    employment_status_a false
    employment_status_b false
    employment_status_c false
    employment_status_d false
    employment_status_p45_supplied true

    address
    venue
    staff_type
    avatar { Rack::Test::UploadedFile.new(TestImageHelper.arnie_face_path) }

    trait :requiring_notification do
      shift_change_occured_at 1.hour.ago
    end

    trait :security do
      after(:build) do |object|
        security_staff_type = StaffType.security.first
        if !security_staff_type.present?
          security_staff_type = FactoryGirl.create(:security_staff_type)
        end
        object.staff_type = security_staff_type
      end

      sia_badge_expiry_date 2.months.from_now
      sia_badge_number '23123131'
      venue nil
    end
  end
end
