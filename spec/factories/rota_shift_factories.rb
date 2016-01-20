FactoryGirl.define do
  factory :rota_shift do
    transient do
      date Time.now
      rota nil
    end

    association :creator, factory: :user
    staff_member

    after(:build) do |object, evaluator|
      object.starts_at = evaluator.date.beginning_of_day + 5.hours
      object.ends_at = evaluator.date.beginning_of_day + 7.hours
      object.rota = evaluator.rota || FactoryGirl.build(
        :rota,
        date: evaluator.date
      )
    end
  end
end
