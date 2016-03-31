FactoryGirl.define do
  factory :change_order do
    submission_deadline { Time.now + 1.week }
    venue
    five_pound_notes 0
    one_pound_coins 0
    fifty_pence_coins  0
    twenty_pence_coins 0
    ten_pence_coins 0
    five_pence_coins 0
  end
end
