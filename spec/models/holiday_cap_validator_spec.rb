require 'rails_helper'

describe HolidayCapValidator do
  include ActiveSupport::Testing::TimeHelpers

  let(:holiday) do
    FactoryGirl.build(
      :holiday,
      validate_as_creation: true,
      staff_member: staff_member,
      start_date: start_date,
      end_date: end_date
    )
  end
  let(:now) { tax_year.end_date - 1.day }
  let(:tax_year) { TaxYear.new(Time.current)}
  let(:start_date) { now.to_date + 1.week }
  let(:end_date) { start_date }
  let(:staff_member) { FactoryGirl.build(:staff_member) }
  let(:user) { FactoryGirl.create(:user) }
  let(:validator) { HolidayCapValidator.new(holiday) }

  around(:each) do |example|
    travel_to now do
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
        previous_holiday_start_date = tax_year.start_date + index.days

        travel_to(previous_holiday_start_date - 1.week) do
          Holiday.create!(
            holiday_type: Holiday::PAID_HOLIDAY_TYPE,
            staff_member: staff_member,
            creator: user,
            start_date: previous_holiday_start_date,
            end_date: previous_holiday_start_date
          )
        end
      end
    end

    context 'number of holidays are at the threshold' do
      let(:holiday_number) { HolidayCapValidator::PAID_HOLIDAY_DAY_CAP - 1 }

      specify 'new holiday is valid' do
        validator.validate
        expect(holiday.errors.to_a).to eq([])
      end
    end

    context 'number of holidays are at the threshold' do
      let(:holiday_number) { HolidayCapValidator::PAID_HOLIDAY_DAY_CAP }

      specify 'new holiday is not valid' do
        validator.validate
        expect(holiday.errors[:base]).to eq([HolidayCapValidator.cap_reached_error_message])
      end
    end
  end
end