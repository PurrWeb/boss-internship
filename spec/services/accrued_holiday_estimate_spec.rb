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

    context 'if staff member has accrues more than 28 days' do
      # should accrue 37 days
      let(:accepted_hours_in_year) { 2500 }

      specify 'accrued days should cap at 28 days' do
        expect(service.call).to eq(28)
      end
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
      minutes_created = 0
      now
      # create owed hours this tax year
      week = RotaWeek.new(current_tax_year.start_date + 1.week)
      date = week.start_date
      rota_shift_date = RotaShiftDate.new(date)

      travel_to(date + 2.months) do
        while minutes_created < owed_hours_minutes
          minutes_to_create = [1200, owed_hours_minutes - minutes_created].min

          OwedHour.create!(
            minutes: minutes_to_create,
            date: date,
            staff_member: staff_member,
            creator: user,
            starts_at: rota_shift_date.start_time,
            ends_at: rota_shift_date.start_time + minutes_to_create.minutes,
            note: 'Test minutes'
          )

          date += 1.day
          rota_shift_date = RotaShiftDate.new(date)
          minutes_created += minutes_to_create
        end
      end
    end

    specify 'should calculate correct number of days rounding down' do
      expect(service.call).to eq(4)
    end

    context 'user also has owed hours in previous year' do
      # Should not increase the year count
      let(:owed_hour_previous_year) { 70 }
      let(:owed_minutes_previous_year) { owed_hour_previous_year * 60 }
      let(:last_tax_year) { TaxYear.new(current_tax_year.start_date - 2.days) }

      before do
        minutes_created = 0

        week = RotaWeek.new(last_tax_year.start_date)
        date = week.start_date
        rota_shift_date = RotaShiftDate.new(date)

        travel_to(date + 3.months) do
          while minutes_created < owed_minutes_previous_year
            minutes_to_create = [1200, owed_minutes_previous_year - minutes_created].min

            OwedHour.create!(
              minutes: minutes_to_create,
              date: date,
              staff_member: staff_member,
              creator: user,
              note: 'Test minutes',
              starts_at: rota_shift_date.start_time,
              ends_at: rota_shift_date.start_time + minutes_to_create.minutes
            )

            date += 1.day
            rota_shift_date = RotaShiftDate.new(date)
            minutes_created += minutes_to_create
          end
        end
      end

      specify 'extra hours should not affect result' do
        expect(service.call).to eq(4)
      end
    end
  end
end