FactoryGirl.define do
  factory :accessory do
    association :venue, factory: :venue
    name "Some name"
    accessory_type Accessory.accessory_types[:misc]
    price_cents 3530
    size nil
    user_requestable false
    disabled_at nil
  end
end
