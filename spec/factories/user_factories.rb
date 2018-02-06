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
    role 'manager'

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
      role "manager"
    end

    trait :ops_manager do
      role "ops_manager"
    end

    trait :admin do
       role User::ADMIN_ROLE
    end

    trait :dev do
       role "dev"
    end

    trait :security_manager do
      role "security_manager"
    end
  end
end
