require 'rails_helper'

describe AccruedHolidayEstimate do
  include ActiveSupport::Testing::TimeHelpers

  let(:now) { Time.current }
  let(:user) { FactoryGirl.create(:user) }
  let(:staff_member) { FactoryGirl.create(:staff_member) }
  let(:current_tax_year) { TaxYear.new(now.to_date) }
  let(:service) { AccruedHolidayEstimate.new(staff_member: staff_member, tax_year: current_tax_year) }

  context 'staff member has accepted hours' do
    let(:accepted_hours_in_year) { 300 }

    before do
      now
      # create accepted hours this year
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
      # Should not increase the year count
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

  context 'staff member has owed hours' do
    let(:owed_hours) { 300 }
    let(:owed_hours_minutes) { owed_hours * 60 }

    before do
      now
      # create owed hours this tax year
      week = RotaWeek.new(current_tax_year.start_date + 1.week)
      start_date = week.start_date

      travel_to(start_date - 1.week) do
        OwedHour.create!(
          minutes: owed_hours_minutes,
          week_start_date: start_date,
          staff_member: staff_member,
          creator: user,
          note: 'Test minutes'
        )
      end
    end

    specify 'should calculate correct number of days rounding down' do
      expect(service.call).to eq(4)
    end

    context 'user also has owed hours in previous year' do
      # Should not increase the year count
      let(:owed_hour_previous_year) { 70 }
      let(:last_tax_year) { TaxYear.new(current_tax_year.start_date - 2.days) }

      before do
        week = RotaWeek.new(last_tax_year.start_date)
        start_date = week.start_date

        travel_to(start_date - 1.week) do
          OwedHour.create!(
            minutes: owed_hour_previous_year,
            week_start_date: start_date,
            staff_member: staff_member,
            creator: user,
            note: 'Test minutes'
          )
        end
      end

      specify 'extra hours should not affect result' do
        expect(service.call).to eq(4)
      end
    end
  end
end
