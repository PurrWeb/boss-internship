FactoryGirl.define do
  factory :dashboard_message do
    title 'Dashboard Message Title'
    message 'Maintenance Task Description'
    published_time Time.now
  end
end
