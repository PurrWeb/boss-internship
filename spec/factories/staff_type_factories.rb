FactoryGirl.define do
  factory :staff_type do
    sequence(:name) do |n|
     "Staff Type #{n}"
    end
  end
end
