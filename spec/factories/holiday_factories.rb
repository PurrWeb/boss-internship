FactoryGirl.define do
  factory :holiday do
    before :create do |holiday|
      holiday.validate_as_creation = true
    end

    start_date { RotaWeek.new(RotaShiftDate.to_rota_date(Time.current + 1.week)).start_date }
    end_date { RotaWeek.new(RotaShiftDate.to_rota_date(Time.current + 1.week)).start_date + 2.days }
    payslip_date { RotaWeek.new(RotaShiftDate.to_rota_date(Time.current + 2.weeks)).start_date }
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
