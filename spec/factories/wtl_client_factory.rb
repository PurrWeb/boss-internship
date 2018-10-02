FactoryGirl.define do
  factory :wtl_client do
    association :wtl_card, factory: :wtl_card
    first_name "John"
    surname "Doe"
    date_of_birth 21.years.ago.to_date
    email "some@email.com"
    university WtlClient::UNIVERSITIES[0]
    gender WtlClient::GENDERS[0]
    phone_number "555-55-55"
    verification_token SecureRandom.hex

    trait :verified do
      verified_at Time.now - 1.day
    end

    trait :enabled do
      status WtlClient.statuses.keys[0]
    end

    trait :disabled do
      status WtlClient.statuses.keys[1]
    end
  end
end
