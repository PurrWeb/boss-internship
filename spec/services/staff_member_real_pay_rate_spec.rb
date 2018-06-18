require 'rails_helper'

describe StaffMemberRealPayRate do
  NORMAL_GROUP_AGE_DATA = [
    {age: 18, expected_payrate_name: PayRate::NORMAL_18_20_PAY_RATE},
    {age: 20, expected_payrate_name: PayRate::NORMAL_18_20_PAY_RATE},
    {age: 21, expected_payrate_name: PayRate::NORMAL_21_24_PAY_RATE},
    {age: 24, expected_payrate_name: PayRate::NORMAL_21_24_PAY_RATE},
    {age: 25, expected_payrate_name: PayRate::NORMAL_25_PLUS_PAY_RATE},
    {age: 26, expected_payrate_name: PayRate::NORMAL_25_PLUS_PAY_RATE}
  ]
  BAR_SUPERVISOR_GROUP_AGE_DATA = [
    {age: 18, expected_payrate_name: PayRate::BAR_SUPERVISOR_PAY_RATE},
    {age: 24, expected_payrate_name: PayRate::BAR_SUPERVISOR_PAY_RATE},
    {age: 25, expected_payrate_name: PayRate::BAR_SUPERVISOR_25_PLUS_PAY_RATE},
    {age: 26, expected_payrate_name: PayRate::BAR_SUPERVISOR_25_PLUS_PAY_RATE}
  ]
  BOLTON_GROUP_AGE_DATA = [
    {age: 18, expected_payrate_name: PayRate::BOLTON_LEVEL_18_20_PAY_RATE},
    {age: 20, expected_payrate_name: PayRate::BOLTON_LEVEL_18_20_PAY_RATE},
    {age: 21, expected_payrate_name: PayRate::BOLTON_LEVEL_21_24_PAY_RATE},
    {age: 24, expected_payrate_name: PayRate::BOLTON_LEVEL_21_24_PAY_RATE},
    {age: 25, expected_payrate_name: PayRate::BOLTON_LEVEL_25_PLUS_PAY_RATE},
    {age: 26, expected_payrate_name: PayRate::BOLTON_LEVEL_25_PLUS_PAY_RATE}
  ]

  SETUP_TEST_DATA = [
    {
      pay_rate_name: PayRate::NORMAL_18_20_PAY_RATE,
      age_data: NORMAL_GROUP_AGE_DATA
    },
    {
      pay_rate_name: PayRate::NORMAL_21_24_PAY_RATE,
      age_data: NORMAL_GROUP_AGE_DATA
    },
    {
      pay_rate_name: PayRate::NORMAL_25_PLUS_PAY_RATE,
      age_data: NORMAL_GROUP_AGE_DATA
    },
    {
      pay_rate_name: PayRate::BAR_SUPERVISOR_PAY_RATE,
      age_data: BAR_SUPERVISOR_GROUP_AGE_DATA
    },
    {
      pay_rate_name: PayRate::BAR_SUPERVISOR_25_PLUS_PAY_RATE,
      age_data: BAR_SUPERVISOR_GROUP_AGE_DATA
    },
    {
      pay_rate_name: PayRate::BOLTON_LEVEL_18_20_PAY_RATE,
      age_data: BOLTON_GROUP_AGE_DATA
    },
    {
      pay_rate_name: PayRate::BOLTON_LEVEL_21_24_PAY_RATE,
      age_data: BOLTON_GROUP_AGE_DATA
    },
    {
      pay_rate_name: PayRate::BOLTON_LEVEL_25_PLUS_PAY_RATE,
      age_data: BOLTON_GROUP_AGE_DATA
    }
  ]

  let(:now) { Time.current }
  let(:user) { FactoryGirl.create(:user) }
  let(:staff_member) {
    FactoryGirl.create(
      :staff_member,
      date_of_birth: date_of_birth,
      pay_rate: original_pay_rate
    )
  }
  let(:service) do
    StaffMemberRealPayRate.new(now: now, staff_member: staff_member)
  end

  let(:setup_existing_pay_rates) do
    PayRate::AGED_PAYRATE_NAMES.each do |pay_rate_name|
      FactoryGirl.create(:pay_rate, name: pay_rate_name)
    end
  end

  before do
    setup_existing_pay_rates
  end

  specify 'a test case exists for all ages pay rates' do
    expect(
      PayRate::AGED_PAYRATE_NAMES.all? do |pay_rate_name|
        pay_rate = PayRate.from_name(pay_rate_name)
        SETUP_TEST_DATA.any? { |test_datum| PayRate.from_name(test_datum.fetch(:pay_rate_name)) == pay_rate }
      end
    ).to eq(true)
  end

  SETUP_TEST_DATA.each do |test_datum|
    context "when payrate is #{test_datum.fetch(:pay_rate_name)}" do
      let(:original_pay_rate) do
        PayRate.from_name(test_datum.fetch(:pay_rate_name))
      end

      before do
        staff_member
      end

      context 'when_staff_member_has no date of birth' do
        let(:date_of_birth) { nil }

        it 'should raise an error' do
          expect {
            service.call
          }.to raise_error(
            PayRateException,
            "Staff Member with ID: #{staff_member.id}, has invalid age: nil"
          )
        end
      end

      context 'when staff member has invalid date of birth' do
        let(:date_of_birth) { now - 17.years }

        it 'should raise an error' do
          expect {
            service.call
          }.to raise_error(
            PayRateException,
            "Staff Member with ID: #{staff_member.id}, has invalid age: #{staff_member.age}"
          )
        end
      end

      test_datum.fetch(:age_data).each do |age_datum|
        context "when age is #{age_datum.fetch(:age)}" do
          let(:date_of_birth) { now - age_datum.fetch(:age).years }
          let(:expected_payrate) { PayRate.from_name(age_datum.fetch(:expected_payrate_name)) }

          it "should return #{age_datum.fetch(:expected_payrate_name)}" do
            expect(
              service.call
            ).to eq(expected_payrate)
          end
        end
      end
    end
  end
end
