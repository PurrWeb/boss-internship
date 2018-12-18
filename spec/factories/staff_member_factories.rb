require_relative '../support/test_image_helper'

FactoryGirl.define do
  factory :staff_member do
    pin_code '235340'
    name
    association :email_address, strategy: :build
    phone_number "1234-567890"
    gender 'female'
    date_of_birth DateTime.new(2000, 1, 1)
    rollbar_guid SecureRandom.uuid
    id_scanner_guid SecureRandom.uuid
    sequence(:national_insurance_number, (50..80).cycle) { |n| "GM-12-#{n}-34-A" }
    creator factory: :user
    starts_at { 1.day.ago }
    association :master_venue, factory: :venue
    allow_no_sage_id false
    pay_rate

    employment_status_a false
    employment_status_b false
    employment_status_c false
    employment_status_d false
    employment_status_p45_supplied true

    address
    staff_type
    avatar { Rack::Test::UploadedFile.new(TestImageHelper.arnie_face_path) }

    trait :marked_retake_avatar do
      after(:create) do |staff_member|
        user = FactoryGirl.create(:user)
        staff_member.update!(marked_retake_avatar_at: Time.now, marked_retake_avatar_user: user)
      end
    end

    trait :flagged do
      after(:create) do |staff_member|
        FactoryGirl.create(
          :staff_member_transition,
          :disabled,
          metadata: {
            disable_reason: 'bad person' ,
            requster_user_id: staff_member.creator.id
          },
          staff_member: staff_member
        )
        staff_member.update_attributes!(
          would_rehire: false
        )
      end
    end

    trait :disabled do
      after(:create) do |staff_member|
        FactoryGirl.create(
          :staff_member_transition,
          :disabled,
          staff_member: staff_member
        )
      end
    end

    trait :requiring_notification do
      shift_change_occured_at 1.hour.ago
    end

    trait :with_password do
      verified_at { 5.minutes.ago }
      password 'password'
    end

    trait :manager do
      after(:build) do |object|
        manager_staff_type = StaffType.manager.first
        if !manager_staff_type.present?
          manager_staff_type = FactoryGirl.create(:manager_staff_type)
        end
        object.staff_type = manager_staff_type
      end
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
      master_venue nil
    end
  end
end
