FactoryGirl.define do
  factory :user do
    name
    association :email_address, strategy: :build
    invite nil
    first true
    rollbar_guid SecureRandom.uuid

    transient do
      venues nil
    end

    after(:create) do |user, evaluator|
      if evaluator.venues.present?
        ActiveRecord::Base.transaction do
          evaluator.venues.each do |venue|
            user.venue_users.create!(venue: venue)
          end
        end
      end
    end

    password "sdlksdsad"
    role User::MANAGER_ROLE

    confirmed_at { 2.weeks.ago }

    trait :disabled do
      after(:create) do |user|
        FactoryGirl.create(
          :user_transition,
          :disabled,
          user: user
        )
      end
    end

    # same as default but included allow explicit coding
    trait :manager do
      role User::MANAGER_ROLE
    end

    trait :ops_manager do
      role User::OPS_MANAGER_ROLE
    end

    trait :admin do
       role User::ADMIN_ROLE
    end

    trait :dev do
       role User::DEV_ROLE
    end

    trait :security_manager do
      role User::SECURITY_MANAGER_ROLE
    end

    trait :marketing_staff do
      role User::MARKETING_ROLE
    end
  end
end
