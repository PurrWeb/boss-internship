FactoryGirl.define do
  factory :machines_refloat do
    user
    machine
    refill_x_10p 0
    cash_in_x_10p 0
    cash_out_x_10p 0
    float_topup_cents 40000
    money_banked_cents 0
  end
end
