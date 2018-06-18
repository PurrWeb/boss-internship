require 'rails_helper'

describe UpdateStaffMembersOnAgedPayRates do
  let(:now) { Time.current }
  let(:service) { UpdateStaffMembersOnAgedPayRates.new(now: now) }
  let(:setup_existing_pay_rates) do
    PayRate::AGED_PAYRATE_NAMES.each do |pay_rate_name|
      FactoryGirl.create(:pay_rate, name: pay_rate_name)
    end
  end

  before do
    setup_existing_pay_rates
  end

  specify do
    staff_member_age = 24
    staff_member = FactoryGirl.create(
      :staff_member,
      date_of_birth: now - staff_member_age.years,
      pay_rate: PayRate.from_name(PayRate::NORMAL_25_PLUS_PAY_RATE)
    )

    service.call

    staff_member.reload
    expect(
      staff_member.pay_rate
    ).to eq(PayRate.from_name(PayRate::NORMAL_21_24_PAY_RATE))
  end
end
