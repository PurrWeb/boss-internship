FactoryGirl.define do
  factory :owed_hour do
    date { RotaShiftDate.to_rota_date(Time.current - 1.week) }
    staff_member
    association :creator, factory: :user
    note 'They just needed the cash'
    minutes 40
    starts_at { RotaShiftDate.new(date).start_time }
    ends_at { RotaShiftDate.new(date).start_time + 40.minutes }
    payslip_date { RotaWeek.new(date + 1.week).start_date }

    trait :disabled do
      disabled_at 2.weeks.ago
    end
  end
end
