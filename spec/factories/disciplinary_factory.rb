FactoryGirl.define do
  factory :disciplinary do
    association :staff_member, factory: :staff_member
    association :created_by_user, factory: :user
    title "Some title"
    level Disciplinary.levels[:first_level]
    conduct "Some conduct"
    nature "Some nature"
    consequence "Some consequence"
    disabled_at nil
  end
end
