FactoryGirl.define do
  factory :venue do
    creator factory: :user
    sequence(:name) do |n|
      "Venue #{n}"
    end
    rollbar_guid SecureRandom.uuid

    safe_float_cents 0
    till_float_cents 0
  end
end
