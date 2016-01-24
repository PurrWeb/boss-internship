FactoryGirl.define do
  factory :user do
    name
    association :email_address, strategy: :build
    invite nil
    first true

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

    # same as default but included allow explicit coding
    trait :manager do
      role "manager"
    end

    trait :admin do
       role "admin"
    end

    trait :dev do
       role "dev"
    end
  end
end
