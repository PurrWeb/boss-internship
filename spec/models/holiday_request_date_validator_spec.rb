require 'rails_helper'

describe HolidayRequestDateValidator do
  include ActiveSupport::Testing::TimeHelpers

  let(:holiday_request) do
     HolidayRequest.new(
       start_date: request_start_date,
       end_date: request_end_date,
       staff_member: staff_member
     ).tap do |holiday_request|
      holiday_request.validate_as_creation = true
     end
  end
  let(:validator) { HolidayRequestDateValidator.new(holiday_request, call_time) }
  let(:staff_member) { FactoryGirl.create(:staff_member) }
  let(:now) { Time.current }
  let(:today) { RotaShiftDate.to_rota_date(now) }
  let(:week_start) { RotaWeek.new(today).start_date }
  let(:request_start_date) { week_start }
  let(:request_end_date) { week_start + 3.days }
  let(:call_time) { now - 4.weeks }

  around(:each) do |example|
    travel_to call_time do
      example.run
    end
  end

  specify do
    validator.validate
    expect(holiday_request.errors.to_a).to eq([])
  end

  context 'conflicting holiday exists' do
    let(:conflicting_holiday) do
      FactoryGirl.create(
        :holiday,
        start_date: request_start_date + 1.day,
        end_date: request_end_date,
        staff_member: staff_member
      )
    end

    before do
      conflicting_holiday
    end

    specify do
      validator.validate
      expect(holiday_request.errors.to_a).to eq(["Request conflicts with an existing holiday"])
    end
  end
end
