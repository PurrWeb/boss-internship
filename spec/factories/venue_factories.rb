FactoryGirl.define do
  factory :venue do
    creator factory: :user
    sequence(:name) do |n|
      "Venue #{n}"
    end

    safe_float_cents 0
    till_float_cents 0
  end
end
