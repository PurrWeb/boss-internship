FactoryGirl.define do
  factory :staff_type do
    creator factory: :user

    sequence(:name) do |n|
     "Staff Type #{n}"
    end
  end
end
