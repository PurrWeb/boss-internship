require 'rails_helper'

describe "HolidayDateValidator update" do
  include ActiveSupport::Testing::TimeHelpers

  let(:holiday) do
    FactoryGirl.create(
      :holiday,
      staff_member: staff_member,
      start_date: start_date,
      end_date: end_date,
      payslip_date: payslip_date
    ).tap do |holiday|
      holiday.validate_as_creation = false
    end
  end
  let(:now) { RotaWeek.new(Time.current.to_date).start_date }
  let(:today) { RotaWeek.new(now).start_date }
  let(:staff_member) { FactoryGirl.build(:staff_member) }
  let(:validator) { HolidayDateValidator.new(holiday) }
  let(:payslip_date) { today }

  around(:each) do |example|
    example.run
  end

  context 'changing dates to in the past' do
    let(:start_date) { today }
    let(:end_date) { today + 1.day }
    let(:update_start_date) { start_date - 2.weeks }
    let(:update_end_date) { end_date - 2.weeks }

    it 'should not raise error' do
      holiday.assign_attributes(
        start_date: update_start_date,
        end_date: update_end_date
      )
      validator.validate
      expect(holiday.errors.keys).to eq([])
    end
  end
end
