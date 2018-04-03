require 'rails_helper'

describe HolidayRequest do
  let(:now) { Time.current }
  let(:business_date) { RotaShiftDate.to_rota_date(now) }
  let(:start_of_future_week) { RotaWeek.new(business_date + 1.week).start_date }
  let(:staff_member) { FactoryGirl.create(:staff_member) }
  let(:user) { FactoryGirl.create(:user) }
  let(:holiday_length_days) { 2 }
  let(:start_date) { start_of_future_week  }
  let(:end_date) { start_of_future_week + (holiday_length_days - 1).days }
  let(:holiday_type) { Holiday::HOLIDAY_TYPES.first }
  let(:staff_member_params) do
    {
      staff_member: staff_member,
      creator: user,
      start_date: start_date,
      end_date: end_date,
      holiday_type: holiday_type
    }
  end
  let(:holiday_request) do
    HolidayRequest.create!(staff_member_params)
  end

  it 'should have correct day_count' do
    expect(holiday_request.days).to eq(holiday_length_days)
  end
end
