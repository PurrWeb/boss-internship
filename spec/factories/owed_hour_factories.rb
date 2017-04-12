FactoryGirl.define do
  factory :owed_hour do
    date { RotaShiftDate.to_rota_date(Time.current + 1.week) }
    staff_member
    association :creator, factory: :user
    note 'They just needed the cash'
    minutes 40

    trait :disabled do
      disabled_at 2.weeks.ago
    end
  end
end
