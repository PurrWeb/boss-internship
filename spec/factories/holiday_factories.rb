FactoryGirl.define do
  factory :holiday do
    start_date { 1.day.from_now.to_date }
    end_date { 2.days.from_now.to_date }
    staff_member
    association :creator, factory: :user
    holiday_type { 'paid_holiday' }

    trait :disabled do
      after(:create) do |holiday|
        FactoryGirl.create(:holiday_transition, :disabled, holiday: holiday)
      end
    end
  end
end
