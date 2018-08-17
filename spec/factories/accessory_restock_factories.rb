FactoryGirl.define do
  factory :accessory_restock do
    association :accessory, factory: :accessory
    association :created_by_user, factory: :user
    accessory_request nil
  end
end
