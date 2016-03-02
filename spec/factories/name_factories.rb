FactoryGirl.define do
  factory :name do
    first_name 'Taylor'
    sequence :surname do |n|
      "Rennie#{n}"
    end
  end
end
