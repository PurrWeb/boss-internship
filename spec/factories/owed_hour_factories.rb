FactoryGirl.define do
  factory :owed_hour do
    week_start_date { RotaWeek.new(RotaShiftDate.to_rota_date(Time.current)).start_date }
    staff_member
    association :creator, factory: :user
    note 'They just needed the cash'
    minutes 40

    trait :disabled do
      disabled_at 2.weeks.ago
    end
  end
end
