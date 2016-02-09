require 'rails_helper'

RSpec.describe NotOnHolidayValidator do
  let(:validator) { NotOnHolidayValidator.new(shift) }
  let(:shift_date) { Date.new(2001, 2, 3) }
  let!(:holiday) do
    FactoryGirl.create(
      :holiday,
      start_date: shift_date - 1.day,
      end_date: shift_date + 1.days
    )
  end
  let(:shift) do
    FactoryGirl.build(
      :rota_shift,
      starts_at: shift_date.beginning_of_day + 10.hours,
      ends_at: shift_date.end_of_day + 14.hours
    )
  end

  specify 'it should set an error on :base' do
    validator.validate
    expect(shift.errors.keys).to eq([:base])
  end

  specify 'it should set an error on :base' do
    validator.validate
    expect(shift.errors[:base]).to eq([staff_member_on_holiday_error_message])
  end

  private
  def staff_member_on_holiday_error_message
    'Staff member is on holiday'
  end
end
