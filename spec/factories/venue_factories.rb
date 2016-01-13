FactoryGirl.define do
  factory :venue do
    creator factory: :user
    sequence(:name) do |n|
      "Venue #{n}"
    end
  end
end
