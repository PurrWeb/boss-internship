FactoryGirl.define do
  factory :accessory_refund_request do
    association :staff_member, factory: :staff_member
    association :accessory_request, factory: :accessory_request
    association :created_by_user, factory: :user
    reusable false
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
