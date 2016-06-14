FactoryGirl.define do
  factory :old_hour do
    week_start_date { RotaWeek.new(Time.current.to_date).start_date }
    staff_member
    association :creator, factory: :user
    note 'They just needed the cash'
    minutes 40

    trait :disabled do
      disabled_at 2.weeks.ago
    end
  end
end
