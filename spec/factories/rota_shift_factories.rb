FactoryGirl.define do
  factory :rota_shift do
    transient do
      starts_at nil
      ends_at nil
      date Time.now
      rota nil
    end

    shift_type 'normal'
    association :creator, factory: :user
    staff_member

    after(:build) do |object, evaluator|
      object.starts_at = evaluator.starts_at || evaluator.date.beginning_of_day + 12.hours
      object.ends_at = evaluator.ends_at || evaluator.date.beginning_of_day + 18.hours
      object.rota = evaluator.rota || FactoryGirl.build(
        :rota,
        date: evaluator.date
      )
    end
  end
end
