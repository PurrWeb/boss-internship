require 'rails_helper'

describe HolidayDateValidator do
  include ActiveSupport::Testing::TimeHelpers

  let(:holiday) do
    FactoryGirl.build(
      :holiday,
      staff_member: staff_member,
      start_date: start_date,
      end_date: end_date,
      payslip_date: payslip_date
    ).tap do |holiday|
      holiday.validate_as_creation = true
    end
  end
  let(:now) { RotaWeek.new(Time.current.to_date).start_date }
  let(:staff_member) { FactoryGirl.build(:staff_member) }
  let(:validator) { HolidayDateValidator.new(holiday) }
  let(:payslip_date) { RotaWeek.new(RotaShiftDate.to_rota_date(now)).start_date }

  around(:each) do |example|
    travel_to now do
      example.run
    end
  end

  context 'dates are in the past' do
    let(:past_week) { RotaWeek.new(now - 3.weeks) }
    let(:past_week_start ) { past_week.start_date }
    let(:start_date) { past_week_start }
    let(:end_date) { past_week_start + 1.day}

    it 'should not raise error' do
      validator.validate
      expect(holiday.errors.keys).to eq([])
    end
  end

  context 'start_date not present' do
    let(:start_date) { nil }
    let(:end_date) { now + 1.hour}

    specify 'no errors should be added' do
      validator.validate
      expect(holiday.errors.keys).to eq([])
    end
  end

  context 'start_date not present' do
    let(:start_date) { now + 1.hour }
    let(:end_date) { nil }

    specify 'no errors should be added' do
      validator.validate
      expect(holiday.errors.keys).to eq([])
    end
  end

  context 'start_date is after end date' do
    let(:start_date) { now + 2.days }
    let(:end_date) { now + 1.day }

    specify 'an error message should be added on base' do
      validator.validate
      expect(
        holiday.errors['base']
      ).to eq(['Start date cannot be after end date'])
    end

    specify 'only an error should be added for base' do
      validator.validate
      expect(holiday.errors.keys).to eq([:base])
    end
  end

  context 'a holiday exists' do
    let(:staff_member) { FactoryGirl.create(:staff_member) }
    let(:existing_holiday) do
      FactoryGirl.create(
        :holiday,
        staff_member: staff_member,
        start_date: existing_holiday_start_date,
        end_date: existing_holiday_end_date
      )
    end

    before do
      existing_holiday
    end

    context 'validating the existing holiday' do
      let(:validator) { HolidayDateValidator.new(existing_holiday) }
      let(:existing_holiday_start_date) { now.to_date + 1.day }
      let(:existing_holiday_end_date) { existing_holiday_start_date + 2.days }

      specify 'no error should be added' do
        validator.validate
        expect(existing_holiday.errors.keys).to eq([])
      end
    end

    context 'end of holiday overlaps with existing' do
      let(:existing_holiday_start_date) { Time.zone.now.to_date.monday + 1.day }
      let(:existing_holiday_end_date) { existing_holiday_start_date + 3.days }
      let(:start_date) { existing_holiday_start_date - 1.days }
      let(:end_date) { existing_holiday_start_date + 1.day }

      specify 'an error message should be added on base' do
        validator.validate
        expect(
          holiday.errors['base']
        ).to eq([overlapping_holiday_error_message])
      end

      specify 'only an error should be added for base' do
        validator.validate
        expect(holiday.errors.keys).to eq([:base])
      end
    end

    context 'start of holiday overlaps with existing' do
      let(:existing_holiday_start_date) { Time.zone.now.to_date.monday + 1.day }
      let(:existing_holiday_end_date) { Time.zone.now.to_date.monday + 3.days }
      let(:start_date) { Time.zone.now.to_date.monday }
      let(:end_date) { Time.zone.now.to_date.monday + 2.days }

      specify 'an error message should be added on base' do
        validator.validate
        expect(
          holiday.errors['base']
        ).to eq([overlapping_holiday_error_message])
      end

      specify 'only an error should be added for base' do
        validator.validate
        expect(holiday.errors.keys).to eq([:base])
      end
    end

    context 'existing holiday dates encloses new dates' do
      let(:existing_holiday_start_date) { Time.zone.now.to_date.monday }
      let(:existing_holiday_end_date) { existing_holiday_start_date + 6.days }
      let(:start_date) { existing_holiday_start_date + 1.days }
      let(:end_date) { existing_holiday_end_date - 1.day }

      specify 'an error message should be added on base' do
        validator.validate
        expect(
          holiday.errors['base']
        ).to eq([overlapping_holiday_error_message])
      end

      specify 'only an error should be added for base' do
        validator.validate
        expect(holiday.errors.keys).to eq([:base])
      end
    end
  end

  context 'a holiday_request exists' do
    let(:staff_member) { FactoryGirl.create(:staff_member) }
    let(:user) { FactoryGirl.create(:user) }
    let(:existing_holiday_request_holiday_type) { Holiday::HOLIDAY_TYPES.first }
    let(:existing_holiday_request) do
      HolidayRequest.create!(
        staff_member: staff_member,
        creator: user,
        start_date: existing_holiday_request_start_date,
        end_date: existing_holiday_request_end_date,
        holiday_type: existing_holiday_request_holiday_type
      )
    end

    before do
      existing_holiday_request
    end

    context 'end of holiday_request overlaps with existing' do
      let(:existing_holiday_request_start_date) { Time.zone.now.to_date.monday + 1.day }
      let(:existing_holiday_request_end_date) { existing_holiday_request_start_date + 3.days }
      let(:start_date) { existing_holiday_request_start_date - 1.days }
      let(:end_date) { existing_holiday_request_start_date + 1.day }

      specify 'an error message should be added on base' do
        validator.validate
        expect(
          holiday.errors['base']
        ).to eq([overlapping_holiday_request_error_message])
      end

      specify 'only an error should be added for base' do
        validator.validate
        expect(holiday.errors.keys).to eq([:base])
      end
    end

    context 'start of holiday_request overlaps with existing' do
      let(:existing_holiday_request_start_date) { Time.zone.now.to_date.monday + 1.day }
      let(:existing_holiday_request_end_date) { Time.zone.now.to_date.monday + 3.days }
      let(:start_date) { Time.zone.now.to_date.monday }
      let(:end_date) { Time.zone.now.to_date.monday + 2.days }

      specify 'an error message should be added on base' do
        validator.validate
        expect(
          holiday.errors['base']
        ).to eq([overlapping_holiday_request_error_message])
      end

      specify 'only an error should be added for base' do
        validator.validate
        expect(holiday.errors.keys).to eq([:base])
      end
    end

    context 'existing holiday_request dates encloses new dates' do
      let(:existing_holiday_request_start_date) { Time.zone.now.to_date.monday }
      let(:existing_holiday_request_end_date) { existing_holiday_request_start_date + 6.days }
      let(:start_date) { existing_holiday_request_start_date + 1.days }
      let(:end_date) { existing_holiday_request_end_date - 1.day }

      specify 'an error message should be added on base' do
        validator.validate
        expect(
          holiday.errors['base']
        ).to eq([overlapping_holiday_request_error_message])
      end

      specify 'only an error should be added for base' do
        validator.validate
        expect(holiday.errors.keys).to eq([:base])
      end
    end
  end

  context 'overlapping shift exist' do
    let(:start_date) { Time.zone.now.to_date.monday + 2.days }
    let(:end_date) { start_date + 1.day }
    let(:shift_starts_at) { start_date.beginning_of_day + 10.hours }
    let(:shift_ends_at) { shift_starts_at + 2.hours }
    let(:rota) do
      FactoryGirl.create(
        :rota,
        date: start_date
      )
    end
    let!(:shift) do
      FactoryGirl.create(
        :rota_shift,
        rota: rota,
        staff_member: holiday.staff_member,
        starts_at: shift_starts_at,
        ends_at: shift_ends_at
      )
    end

    specify 'an error message should be added on base' do
      validator.validate
      expect(
        holiday.errors['base']
      ).to eq([overlapping_shift_error_message])
    end

    specify 'only an error should be added for base' do
      validator.validate
      expect(holiday.errors.keys).to eq([:base])
    end
  end

  context 'overlapping owed_hour exist' do
    let(:now) { Time.current }
    let(:start_date) { RotaShiftDate.to_rota_date(now) }
    let(:end_date) { start_date }
    let(:owed_hour_starts_at) { start_date.beginning_of_day + 10.hours }
    let(:owed_hour_ends_at) { owed_hour_starts_at + 2.hours }
    let(:owed_hour) do
      FactoryGirl.create(
        :owed_hour,
        date: start_date,
        staff_member: holiday.staff_member,
        starts_at: owed_hour_starts_at,
        ends_at: owed_hour_ends_at,
        payslip_date: holiday.payslip_date,
        finance_report: holiday.finance_report,
        minutes: 120
      )
    end

    before do
      owed_hour
    end

    specify 'an error message should be added on base' do
      validator.validate
      expect(
        holiday.errors['base']
      ).to eq([overlapping_owed_hour_error_message])
    end

    specify 'only an error should be added for base' do
      validator.validate
      expect(holiday.errors.keys).to eq([:base])
    end
  end

  context 'holiday is not conatined within one week' do
    let(:start_date) do
      # Saturday
      Time.zone.now.beginning_of_week.to_date + 6.days
    end
    let(:end_date) do
      # the next Wednesday
      start_date + 4.days
    end

    specify 'an error message should be added on base' do
      validator.validate
      expect(
        holiday.errors['base']
      ).to eq([mulitple_week_error_message])
    end

    specify 'only an error should be added for base' do
      validator.validate
      expect(holiday.errors.keys).to eq([:base])
    end
  end

  context 'overlapping hours acceptance period' do
    let(:now) { Time.current }
    let(:user) { FactoryGirl.create(:user) }
    let(:venue) { FactoryGirl.create(:venue) }
    let(:start_date) { RotaShiftDate.to_rota_date(now) }
    let(:end_date) { start_date }
    let(:hour_acceptance_period_starts_at) { start_date.beginning_of_day + 10.hours }
    let(:hour_acceptance_period_ends_at) { hour_acceptance_period_starts_at + 2.hours }
    let(:clock_in_day) do
      result = ClockInDay.find_by(staff_member: staff_member, date: start_date, venue: venue)
      result || ClockInDay.create!(
        creator: user,
        staff_member: staff_member,
        date: start_date,
        venue: venue
      )
    end
    let(:finance_report) do
      FactoryGirl.create(
        :finance_report,
        staff_member: clock_in_day.staff_member,
        venue: clock_in_day.staff_member.master_venue,
        week_start: RotaWeek.new(RotaShiftDate.to_rota_date(now)).start_date
      )
    end
    let(:hour_acceptance_period) do
      HoursAcceptancePeriod.create!(
        creator: user,
        clock_in_day: clock_in_day,
        starts_at: hour_acceptance_period_starts_at,
        ends_at: hour_acceptance_period_ends_at,
        status: 'accepted',
        accepted_at: now,
        accepted_by: user,
        finance_report: finance_report
      )
    end

    before do
      hour_acceptance_period
    end

    specify 'an error message should be added on base' do
      validator.validate
      expect(
        holiday.errors['base']
      ).to eq([overlapping_hour_acceptance_period_error_message])
    end

    specify 'only an error should be added for base' do
      validator.validate
      expect(holiday.errors.keys).to eq([:base])
    end
  end

  context 'holiday is not conatined within one week' do
    let(:start_date) do
      # Saturday
      Time.zone.now.beginning_of_week.to_date + 6.days
    end
    let(:end_date) do
      # the next Wednesday
      start_date + 4.days
    end

    specify 'an error message should be added on base' do
      validator.validate
      expect(
        holiday.errors['base']
      ).to eq([mulitple_week_error_message])
    end

    specify 'only an error should be added for base' do
      validator.validate
      expect(holiday.errors.keys).to eq([:base])
    end
  end

  private
  def overlapping_shift_error_message
    'Staff member is assigned shifts on one of these days'
  end

  def overlapping_owed_hour_error_message
    "Staff member is assigned owed hours on one of these days"
  end

  def overlapping_holiday_error_message
    "Holiday conflicts with an existing holiday"
  end

  def overlapping_holiday_request_error_message
    "Holiday conflicts with an existing holiday request"
  end

  def mulitple_week_error_message
    "Holiday must be within a single week"
  end

  def overlapping_hour_acceptance_period_error_message
    "Staff member has hours accepted for the day in question"
  end
end
