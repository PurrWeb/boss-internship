FactoryGirl.define do
  factory :staff_type do
    sequence(:name) do |n|
     "Staff Type #{n}"
    end

    role 'normal'
    ui_color 'AABBCC'

    factory :pr_staff_type do
      name 'Pr'
    end

    factory :kitchen_staff_type do
      name 'Chef'
    end

    factory :security_staff_type do
      name 'security'
      role 'security'
    end
  end
end
