require 'rails_helper'

describe AccruedHolidayEstimate do
  include ActiveSupport::Testing::TimeHelpers

  let(:now) { Time.current }
  let(:user) { FactoryGirl.create(:user) }
  let(:staff_member) { FactoryGirl.create(:staff_member) }
  let(:current_tax_year) { TaxYear.new(now.to_date) }
  let(:accepted_hours_in_year) { 300 }
  # Should not increase the year count
  let(:service) { AccruedHolidayEstimate.new(staff_member: staff_member, tax_year: current_tax_year) }

  before do
    now
    # create accpeted hours this year
    date = current_tax_year.start_date

    hours_created_in_year = 0
    while hours_created_in_year < accepted_hours_in_year
      shift_date = RotaShiftDate.new(date)

      clock_in_day = ClockInDay.create!(
        staff_member: staff_member,
        venue: staff_member.master_venue,
        date: date,
        creator: user
      )

      HoursAcceptancePeriod.create!(
        creator: user,
        starts_at: shift_date.start_time,
        ends_at: shift_date.start_time + 10.hours,
        clock_in_day: clock_in_day,
        status: HoursAcceptancePeriod::ACCEPTED_STATE
      )

      hours_created_in_year = hours_created_in_year + 10
      date = date + 1.day
    end
  end

  specify 'should calculate correct number of days rounding down' do
    expect(service.call).to eq(4)
  end

  context 'user also has accrued coliday hours in previous year' do
    let(:accepted_hours_previous_year) { 70 }
    let(:last_tax_year) { TaxYear.new(current_tax_year.start_date - 2.days) }

    before do
      date = last_tax_year.start_date
      hours_created_previous_year = 0
      while hours_created_previous_year < accepted_hours_previous_year
        shift_date = RotaShiftDate.new(date)

        clock_in_day = ClockInDay.create!(
          staff_member: staff_member,
          venue: staff_member.master_venue,
          date: date,
          creator: user
        )

        HoursAcceptancePeriod.create!(
          creator: user,
          starts_at: shift_date.start_time,
          ends_at: shift_date.start_time + 10.hours,
          clock_in_day: clock_in_day,
          status: HoursAcceptancePeriod::ACCEPTED_STATE
        )

        hours_created_previous_year = hours_created_previous_year + 10
        date = date + 1.day
      end
    end

    specify 'hours should not count towards accrued days' do
      expect(service.call).to eq(4)
    end
  end
end
