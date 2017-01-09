FactoryGirl.define do
  factory :api_key do
    user
    venue
    key_type 'boss'
  end
end
