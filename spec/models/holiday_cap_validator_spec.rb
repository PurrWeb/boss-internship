require 'rails_helper'

describe HolidayCapValidator do
  include ActiveSupport::Testing::TimeHelpers

  let(:holiday) do
    FactoryGirl.build(
      :holiday,
      holiday_type: holiday_type,
      staff_member: staff_member,
      start_date: start_date,
      end_date: end_date,
      payslip_date: payslip_date
    ).tap do |holiday|
      holiday.validate_as_creation = true
    end
  end
  let(:holiday_type) { Holiday::PAID_HOLIDAY_TYPE }
  let(:call_time) { tax_year.start_date + 1.day }
  let(:now) { Time.current }
  let(:tax_year) { TaxYear.new(now)}
  let(:end_of_current_tax_year) { tax_year.end_date }
  let(:start_date) { now.to_date + 1.week }
  let(:end_date) { start_date }
  let(:payslip_date) { start_date }
  let(:staff_member) { FactoryGirl.build(:staff_member) }
  let(:user) { FactoryGirl.create(:user) }
  let(:validator) { HolidayCapValidator.new(holiday) }

  around(:each) do |example|
    travel_to call_time do
      example.run
    end
  end

  specify do
    expect(holiday).to be_valid
  end

  specify do
    validator.validate
    expect(holiday).to be_valid
  end

  context 'staff member has paid holidays in the tax year' do
    before do
      holiday_number.times do |index|
        previous_holiday_start_date = call_time + index.days

        travel_to(previous_holiday_start_date - 1.week) do
          Holiday.create!(
            holiday_type: Holiday::PAID_HOLIDAY_TYPE,
            staff_member: staff_member,
            creator: user,
            start_date: previous_holiday_start_date,
            end_date: previous_holiday_start_date,
            payslip_date: previous_holiday_start_date
          )
        end
      end
    end

    context 'number of holidays are at the threshold for current year' do
      let(:holiday_number) { HolidayCapValidator::PAID_HOLIDAY_DAY_CAP - 1 }

      specify 'new holiday is valid' do
        validator.validate
        expect(holiday.errors.to_a).to eq([])
      end
    end

    context 'number of holidays are at the threshold for current year' do
      let(:holiday_number) { HolidayCapValidator::PAID_HOLIDAY_DAY_CAP }

      specify 'new holiday is not valid' do
        validator.validate
        expect(holiday.errors[:base]).to eq([HolidayCapValidator.cap_reached_error_message])
      end

      context 'when holiday is unpaid' do
        let(:holiday_type) { Holiday::UNPAID_HOLIDAY_TYPES.first }

        specify 'new holiday should be valid' do
          validator.validate
          expect(holiday.errors.to_a).to eq([])
        end
      end

      context 'creating a holiday in future tax year' do
        let(:start_date) do
          end_of_current_tax_year +
            HolidayCapValidator::PAID_HOLIDAY_DAY_CAP.days +
            1.week
        end
        let(:end_date) { start_date + 1.day }
        let(:future_tax_year) { TaxYear.new(start_date) }

        specify 'new holiday should be valid' do
          validator.validate
          expect(holiday.errors.to_a).to eq([])
        end

        context 'future year is also at holiday cap' do
          before do
            holiday_number.times do |index|
              previous_holiday_start_date = future_tax_year.start_date + index.days
              Holiday.create!(
                holiday_type: Holiday::PAID_HOLIDAY_TYPE,
                staff_member: staff_member,
                creator: user,
                start_date: previous_holiday_start_date,
                end_date: previous_holiday_start_date,
                payslip_date: previous_holiday_start_date
              )
            end
          end

          specify 'new holiday is not valid' do
            validator.validate
            expect(holiday.errors[:base]).to eq([HolidayCapValidator.cap_reached_error_message])
          end
        end
      end
    end
  end
end
