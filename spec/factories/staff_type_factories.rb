FactoryGirl.define do
  factory :staff_type do
    sequence(:name) do |n|
     "Staff Type #{n}"
    end

    role 'normal'
    ui_color 'AABBCC'
  end
end
