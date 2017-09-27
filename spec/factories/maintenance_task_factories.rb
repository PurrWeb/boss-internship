FactoryGirl.define do
  factory :maintenance_task do
    title 'Maintenance Task Title'
    description 'Maintenance Task Description'
    priority MaintenanceTask::LOW_PRIORITY_ENUM_VALUE
    venue
  end

  factory :maintenance_task_note do
    maintenance_task
    note 'Maintenance Task Note Text'
  end
end
