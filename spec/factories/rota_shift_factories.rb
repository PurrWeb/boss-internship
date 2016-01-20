FactoryGirl.define do
  factory :rota_shift do
    association :creator, factory: :user
    rota
    staff_member
    starts_at { 2.hours.ago }
    ends_at { 1.hour.ago }
  end
end
