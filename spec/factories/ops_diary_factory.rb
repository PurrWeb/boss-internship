FactoryGirl.define do
  factory :ops_diary do
    association :venue, factory: :venue
    title "Some title"
    text "Some text"
    priority OpsDiary.priorities[:medium]
    association :created_by_user, factory: :user
    disabled_at nil
  end
end
