FactoryGirl.define do
  factory :wtl_client do
    association :wtl_card, factory: :wtl_card
    first_name "John"
    surname "Doe"
    date_of_birth 21.years.ago.to_date
    email "some@email.com"
    university WtlClient::UNIVERSITIES[0]
    gender WtlClient::GENDERS[0]
    verification_token SecureRandom.hex
  end
end
