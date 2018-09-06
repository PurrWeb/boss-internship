FactoryGirl.define do
  factory :accessory_request do
    association :staff_member, factory: :staff_member
    association :accessory, factory: :accessory
    association :created_by_user, factory: :user
    trait :accepted do
      after(:create) do |object|
        object.transition_to!(:accepted)
      end
    end
    trait :completed do
      after(:create) do |object|
        object.transition_to!(:accepted)
        object.transition_to!(:completed)
      end
    end
  end
end
