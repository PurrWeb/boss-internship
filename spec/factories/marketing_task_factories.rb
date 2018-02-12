FactoryGirl.define do
  factory :marketing_task do
    title 'Marketing Task Title'
    due_at Date.tomorrow
    venue
  end

  factory :general_task, parent: :marketing_task, class: 'GeneralTask'

  factory :marketing_task_note do
    marketing_task
    note 'Marketing Task Note Text'
  end
end
