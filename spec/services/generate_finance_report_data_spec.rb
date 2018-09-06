require 'rails_helper'

describe GenerateFinanceReportData do
  include ActiveSupport::Testing::TimeHelpers

  let(:now) { Time.current }
  let(:user) do
    FactoryGirl.create(:user)
  end
  let(:pay_rate_cents) { 2000 }
  let(:weekly_pay_rate) do
    PayRate.create!(
      pay_rate_type: PayRate::NAMED_PAYRATE_TYPE,
      calculation_type: PayRate::HOURLY_CALCULATION_TYPE,
      cents: pay_rate_cents
    )
  end
  let(:staff_member) do
    FactoryGirl.create(
      :staff_member,
      pay_rate: weekly_pay_rate
    )
  end
  let(:venue) { staff_member.master_venue }
  let(:service) do
    GenerateFinanceReportData.new(
      staff_member: staff_member,
      week: previous_week
    )
  end
  let(:current_week) { RotaWeek.new(RotaShiftDate.to_rota_date(now)) }
  let(:previous_week) { RotaWeek.new(RotaShiftDate.to_rota_date(now - 1.week)) }
  let(:accessory_date) { previous_week.start_date }
  let(:shift_date) { previous_week.start_date + 1.day }
  let(:owed_hour_date) { owed_hour_create_week.start_date }
  let(:shift_length_hours) { 6 }
  let(:shift_starts_at) { RotaShiftDate.new(shift_date).start_time }
  let(:shift_ends_at) { shift_starts_at + shift_length_hours.hours }
  let(:call_date) { current_week.start_date + 1.day }
  let(:call_date_start_time) { RotaShiftDate.new(call_date).start_time }
  let(:call_time) { call_date_start_time + 4.hours }
  let(:owed_hour_hours) { 4 }
  let(:owed_hour_minutes) { owed_hour_hours * 60 }
  let(:owed_hour_starts_at) { RotaShiftDate.new(owed_hour_date).start_time }
  let(:owed_hour_ends_at) { owed_hour_starts_at + owed_hour_minutes.minutes}
  let(:owed_hour_create_time) { RotaShiftDate.new(owed_hour_create_week.start_date).start_time }
  let(:accessory_pounds) { 40 }
  let(:expected_holiday_days_count) { 2 }
  let(:result) { service.call }

  around(:each) do |example|
    travel_to call_time do
      example.run
    end
  end

  before do
    travel_to RotaShiftDate.new(clock_in_period_create_date).start_time + 1.minute do
      clock_in_day = ClockInDay.create!(
        date: shift_date,
        staff_member: staff_member,
        venue: venue,
        creator: user
      )

      finance_report = FactoryGirl.create(
        :finance_report,
        staff_member: staff_member,
        venue: staff_member.master_venue,
        week_start: RotaWeek.new(RotaShiftDate.to_rota_date(Time.current)).start_date
      )
      HoursAcceptancePeriod.create!(
        clock_in_day: clock_in_day,
        starts_at: shift_starts_at,
        ends_at: shift_ends_at,
        creator: user,
        status: HoursAcceptancePeriod::ACCEPTED_STATE,
        accepted_at: Time.current,
        finance_report: finance_report,
        accepted_by: user
      )
    end

    travel_to RotaShiftDate.new(holiday_create_date).start_time do
      holiday_finance_report = FactoryGirl.create(
        :finance_report,
        staff_member: staff_member,
        venue: staff_member.master_venue,
        week_start: RotaWeek.new(holiday_payslip_date).start_date
      )
      Holiday.create!(
        staff_member: staff_member,
        start_date: holiday_start_date,
        end_date: holiday_end_date,
        holiday_type: Holiday::PAID_HOLIDAY_TYPE,
        payslip_date: holiday_payslip_date,
        finance_report: holiday_finance_report,
        creator: user
      )
    end

    travel_to RotaShiftDate.new(accessory_create_date).start_time do
      accessory = Accessory.create!(
        name: 'Foo',
        price_cents: accessory_pounds * 100,
        venue: venue,
        accessory_type: :misc,
        user_requestable: false
      )

      request = AccessoryRequest.create!(
        accessory: accessory,
        staff_member: staff_member,
        price_cents: accessory.price_cents,
        accessory_type: accessory.accessory_type
      )
      request.transition_to!(:accepted)
      request.transition_to!(:completed)
    end

    finance_report = FactoryGirl.create(
      :finance_report,
      staff_member: staff_member,
      venue: staff_member.master_venue,
      week_start: RotaWeek.new(owed_hours_payslip_date).start_date
    )

    travel_to RotaShiftDate.new(owed_hour_create_date).start_time do
      OwedHour.create!(
        staff_member: staff_member,
        date: owed_hour_date,
        minutes: owed_hour_minutes,
        starts_at: owed_hour_starts_at,
        ends_at: owed_hour_ends_at,
        creator: user,
        note: 'Blah Blah',
        payslip_date: owed_hours_payslip_date,
        finance_report: finance_report
      )
    end
  end

  context 'owed hours and holidays are in same payslip week' do
    let(:clock_in_period_create_date) { previous_week.start_date }
    let(:holiday_create_date) { clock_in_period_create_date }
    let(:holiday_payslip_date) { previous_week.start_date }
    let(:holiday_start_date) { previous_week.start_date + 3.days }
    let(:holiday_end_date) { holiday_start_date + (expected_holiday_days_count - 1).days }
    let(:accessory_create_date) { clock_in_period_create_date }
    let(:owed_hour_create_week) { previous_week }
    let(:owed_hour_create_date) { owed_hour_create_week.start_date + 3.days }
    let(:owed_hours_payslip_date) { previous_week.start_date }

    it 'should return correct finance report' do
      finance_report = result.report
      expect(finance_report.staff_member).to eq(staff_member)
      expect(finance_report.staff_member_name).to eq(staff_member.full_name)
      expect(finance_report.week_start).to eq(previous_week.start_date)
      expect(finance_report.pay_rate_description).to eq(staff_member.pay_rate.text_description_short)
      expect(finance_report.venue).to eq(venue)
      expect(finance_report.venue_name).to eq(venue.name)

      expect(finance_report.monday_hours_count).to eq(0)
      expect(finance_report.tuesday_hours_count).to eq(shift_length_hours.to_f)
      expect(finance_report.wednesday_hours_count).to eq(0)
      expect(finance_report.thursday_hours_count).to eq(0)
      expect(finance_report.friday_hours_count).to eq(0)
      expect(finance_report.saturday_hours_count).to eq(0)
      expect(finance_report.sunday_hours_count).to eq(0)
      expect(finance_report.total_hours_count).to eq(shift_length_hours.to_f)

      expect(finance_report.holiday_days_count).to eq(expected_holiday_days_count)
      expect(finance_report.owed_hours_minute_count).to eq(owed_hour_minutes)
      expect(finance_report.accessories_cents).to eq(accessory_pounds * 100 * -1)
      expect(finance_report.contains_time_shifted_owed_hours).to eq(false)
      expect(finance_report.contains_time_shifted_holidays).to eq(false)
      expected_total_cents = (shift_length_hours *  staff_member.pay_rate.cents) + (owed_hour_hours * staff_member.pay_rate.cents) - (accessory_pounds * 100)
      expect(finance_report.total_cents).to eq(expected_total_cents)
      expect(finance_report).to_not be_valid
    end
  end

  context 'owed hours and holidays are in shifted payslip week' do
    let(:clock_in_period_create_date) { previous_week.start_date}
    let(:accessory_create_date) { clock_in_period_create_date }
    let(:past_week) { RotaWeek.new(current_week.start_date - 3.weeks) }
    let(:holiday_create_date) { past_week.start_date }
    let(:holiday_payslip_date) { previous_week.start_date  }
    let(:holiday_start_date) { past_week.start_date + 3.days }
    let(:holiday_end_date) { holiday_start_date + (expected_holiday_days_count - 1).days }
    let(:owed_hour_create_week) { past_week }
    let(:owed_hour_create_date) { owed_hour_create_week.start_date + 3.days }
    let(:owed_hours_payslip_date) { previous_week.start_date }

    it 'should return correct finance report' do
      finance_report = result.report
      expect(finance_report.staff_member).to eq(staff_member)
      expect(finance_report.staff_member_name).to eq(staff_member.full_name)
      expect(finance_report.week_start).to eq(previous_week.start_date)
      expect(finance_report.pay_rate_description).to eq(staff_member.pay_rate.text_description_short)
      expect(finance_report.venue).to eq(venue)
      expect(finance_report.venue_name).to eq(venue.name)

      expect(finance_report.monday_hours_count).to eq(0)
      expect(finance_report.tuesday_hours_count).to eq(shift_length_hours.to_f)
      expect(finance_report.wednesday_hours_count).to eq(0)
      expect(finance_report.thursday_hours_count).to eq(0)
      expect(finance_report.friday_hours_count).to eq(0)
      expect(finance_report.saturday_hours_count).to eq(0)
      expect(finance_report.sunday_hours_count).to eq(0)
      expect(finance_report.total_hours_count).to eq(shift_length_hours.to_f)

      expect(finance_report.holiday_days_count).to eq(expected_holiday_days_count)
      expect(finance_report.owed_hours_minute_count).to eq(owed_hour_minutes)
      expect(finance_report.accessories_cents).to eq(accessory_pounds * 100 * -1)
      expect(finance_report.contains_time_shifted_owed_hours).to eq(true)
      expect(finance_report.contains_time_shifted_holidays).to eq(true)
      expected_total_cents = (shift_length_hours *  staff_member.pay_rate.cents) + (owed_hour_hours * staff_member.pay_rate.cents) - (accessory_pounds * 100)
      expect(finance_report.total_cents).to eq(expected_total_cents)

      # This will be invalid untill the correct method is called to
      # update it's status in the calling class
      expect(finance_report).to_not be_valid
    end
  end
end
