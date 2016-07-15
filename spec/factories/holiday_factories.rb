FactoryGirl.define do
  factory :holiday do
    start_date { RotaWeek.new(Time.current.to_date).start_date }
    end_date { RotaWeek.new(Time.current.to_date).start_date + 2.days }
    staff_member
    association :creator, factory: :user
    holiday_type { Holiday::PAID_HOLIDAY_TYPE }

    trait :disabled do
      after(:create) do |holiday|
        FactoryGirl.create(:holiday_transition, :disabled, holiday: holiday)
      end
    end
  end
end
