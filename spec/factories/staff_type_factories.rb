FactoryGirl.define do
  factory :staff_type do
    sequence(:name) do |n|
     "Staff Type #{n}"
    end

    role 'normal'
    ui_color StaffType::VALID_COLORS.first

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

    factory :manager_staff_type do
      name 'Manager'
    end
  end
end
