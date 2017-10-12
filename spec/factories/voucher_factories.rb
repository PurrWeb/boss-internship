FactoryGirl.define do
  factory :voucher do
    creator factory: :user
    description "test description"
    enabled true
    venue
  end
end
