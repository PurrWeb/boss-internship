require 'rails_helper'

describe UpdateFinanceReportData do
  include ActiveSupport::Testing::TimeHelpers

  let(:now) { Time.current }
  let(:previous_week) { RotaWeek.new(RotaShiftDate.to_rota_date(now - 1.week)) }
  let(:current_week) { RotaWeek.new(RotaShiftDate.to_rota_date(now)) }
  let(:future_week) { RotaWeek.new(RotaShiftDate.to_rota_date(now + 1.week)) }
  let(:hourly_pay_rate) do
    FactoryGirl.create(:pay_rate, calculation_type: PayRate::HOURLY_CALCULATION_TYPE, cents: 100)
  end
  let(:staff_member) { FactoryGirl.create(:staff_member, pay_rate: pay_rate) }
  let(:finance_report) { FactoryGirl.create(:finance_report, default_finance_report_factory_params) }
  let(:venue) { staff_member.master_venue }
  let(:user) { FactoryGirl.create(:user) }
  let(:service) { UpdateFinanceReportData.new(requester: user, finance_report: finance_report) }
  let(:pay_rate) { hourly_pay_rate }
  let(:call_time) { RotaShiftDate.new(future_week.start_date).start_time }
  let(:default_finance_report_factory_params) do
    {
      venue_name: venue.name,
      staff_member_name: staff_member.full_name,
      pay_rate_description: pay_rate.text_description_short,
      accessories_cents: nil,
      contains_time_shifted_owed_hours: nil,
      contains_time_shifted_holidays: nil,
      monday_hours_count: nil,
      tuesday_hours_count: nil,
      wednesday_hours_count: nil,
      thursday_hours_count: nil,
      friday_hours_count: nil,
      saturday_hours_count: nil,
      sunday_hours_count: nil,
      total_hours_count: nil,
      owed_hours_minute_count: nil,
      total_cents: nil,
      holiday_days_count: nil,
      staff_member: staff_member,
      venue: venue,
      week_start: current_week.start_date
    }
  end
  let(:default_finance_report_values) do
    default_finance_report_factory_params.merge({
      requiring_update: true,
      current_state: FinanceReportStateMachine::REQUIRING_UPDATE_STATE.to_s
    })
  end
  let(:empty_valid_finace_report_values) do
    {
      venue_name: venue.name,
      staff_member_name: staff_member.full_name,
      pay_rate_description: pay_rate.text_description_short,
      accessories_cents: 0,
      contains_time_shifted_owed_hours: false,
      contains_time_shifted_holidays: false,
      monday_hours_count: 0,
      tuesday_hours_count: 0,
      wednesday_hours_count: 0,
      thursday_hours_count: 0,
      friday_hours_count: 0,
      saturday_hours_count: 0,
      sunday_hours_count: 0,
      total_hours_count: 0,
      owed_hours_minute_count: 0,
      total_cents: 0,
      holiday_days_count: 0,
      requiring_update: false,
      current_state: FinanceReportStateMachine::READY_STATE.to_s
    }
  end

  around(:each) do |example|
    current_week
    default_finance_report_factory_params
    previous_week
    future_week
    travel_to call_time do
      example.run
    end
  end

  context 'before call' do
    specify 'finance_report should have wrong data and require update' do
      expect_finance_report_values(finance_report: finance_report, expected_values: default_finance_report_values)
    end
  end

  context 'no data exists' do
    specify 'should update report to valid empty values' do
      service.call(now: call_time)
      finance_report.reload
      expect_finance_report_values(finance_report: finance_report, expected_values: empty_valid_finace_report_values)
    end
  end

  context 'hours exist' do
    let(:expected_values) do
      empty_valid_finace_report_values.merge({
        monday_hours_count: 2.0,
        tuesday_hours_count: 2.0,
        wednesday_hours_count: 2.0,
        thursday_hours_count: 2.0,
        friday_hours_count: 2.0,
        saturday_hours_count: 2.0,
        sunday_hours_count: 2.0,
        total_hours_count: 14.0,
        total_cents: 1400
      })
    end

    before do
      current_week.each_with_day do |date|
        start_of_day = RotaShiftDate.new(date).start_time
        travel_to start_of_day do
          clock_in_day = ClockInDay.create!(
            date: date,
            staff_member: staff_member,
            venue: venue,
            creator: user
          )

          HoursAcceptancePeriod.create!(
            clock_in_day: clock_in_day,
            finance_report: finance_report,
            creator: user,
            starts_at: start_of_day,
            status: HoursAcceptancePeriod::ACCEPTED_STATE,
            ends_at: start_of_day + 2.hours,
            accepted_at: start_of_day + 20.hours,
            accepted_by: user
          )
        end
      end
    end

    specify 'service should update report hour data' do
      service.call(now: call_time)
      finance_report.reload
      expect_finance_report_values(finance_report: finance_report, expected_values: expected_values)
    end

    specify 'should set finance report to not requiring update' do
      service.call(now: call_time)
      finance_report.reload
      expect(finance_report.ready?).to eq(true)
    end
  end

  context 'owed_hours exist' do
    let(:owed_hour_minutes) { 300 }
    before do
      start_date = previous_week.start_date
      start_of_day = RotaShiftDate.new(start_date).start_time
      travel_to start_of_day do
        owed_hour_date = start_date - 3.weeks
        owed_hour_start_time = RotaShiftDate.new(owed_hour_date).start_time
        OwedHour.create!(
          date: start_date - 3.weeks,
          starts_at: owed_hour_start_time,
          ends_at: owed_hour_start_time + owed_hour_minutes.minutes,
          staff_member: staff_member,
          minutes: owed_hour_minutes,
          payslip_date: current_week.start_date,
          creator: user,
          note: 'Foo'
        )
      end
    end

    let(:expected_values) do
      empty_valid_finace_report_values.merge({
        owed_hours_minute_count: owed_hour_minutes,
        total_cents: 500,
        contains_time_shifted_owed_hours: true
      })
    end

    specify 'service should update report owed_hour data' do
      service.call(now: call_time)
      finance_report.reload
      expect_finance_report_values(finance_report: finance_report, expected_values: expected_values)
    end

    specify 'should set finance report to not requiring update' do
      service.call(now: call_time)
      finance_report.reload
      expect(finance_report.ready?).to eq(true)
    end
  end

  context 'accepted accessory requests exist' do
    let(:expected_values) do
      empty_valid_finace_report_values.merge({
      })
    end

    specify 'service should update report accesory request data' do
      service.call(now: call_time)
      finance_report.reload
      expect_finance_report_values(finance_report: finance_report, expected_values: expected_values)
    end

    specify 'should set finance report to not requiring update' do
      service.call(now: call_time)
      finance_report.reload
      expect(finance_report.ready?).to eq(true)
    end
  end

  context 'completed accessory requests exist' do
    let(:accessory_price_cents) { 300 }
    before do
      accessory = Accessory.create!(
        name: 'foo',
        accessory_type: :misc,
        price_cents: accessory_price_cents,
        venue: venue,
        user_requestable: false
      )
      accessory_request = AccessoryRequest.create!(
        accessory: accessory,
        accessory_type: accessory.accessory_type,
        staff_member: staff_member,
        price_cents: accessory.price_cents,
      )
      accessory_request.transition_to!(:accepted)
      accessory_request.transition_to!(:completed)
    end

    let(:expected_values) do
      empty_valid_finace_report_values.merge({
        accessories_cents: -300,
        total_cents: -300,
        current_state: FinanceReportStateMachine::INCOMPLETE_STATE.to_s
      })
    end

    specify 'service should update report accepted accessory refund request data' do
      service.call(now: call_time)
      finance_report.reload
      expect_finance_report_values(finance_report: finance_report, expected_values: expected_values)
    end

    specify 'should set finance report to not requiring update' do
      service.call(now: call_time)
      finance_report.reload
      expect(finance_report.incomplete?).to eq(true)
    end
  end

  context 'completed accessory refund requests exist' do
    let(:accessory_price_cents) { 300 }
    before do
      accessory = Accessory.create!(
        name: 'foo',
        accessory_type: :misc,
        price_cents: accessory_price_cents,
        venue: venue,
        user_requestable: false
      )

      accessory_request = nil
      travel_to now - 4.weeks do
        accessory_request = AccessoryRequest.create!(
          accessory: accessory,
          accessory_type: accessory.accessory_type,
          staff_member: staff_member,
          price_cents: accessory.price_cents,
        )
        accessory_request.transition_to!(:accepted)
        accessory_request.transition_to!(:completed)
      end

      accessory_refund_request = AccessoryRefundRequest.create!(
        accessory_request: accessory_request,
        staff_member: staff_member,
        price_cents: accessory.price_cents
      )
      accessory_refund_request.transition_to!(:accepted)
      accessory_refund_request.transition_to!(:completed)
    end

    let(:expected_values) do
      empty_valid_finace_report_values.merge({
        accessories_cents: 300,
        total_cents: 300
      })
    end

    specify 'service should update report accepted accessory refund request data' do
      service.call(now: call_time)
      finance_report.reload
      expect_finance_report_values(finance_report: finance_report, expected_values: expected_values)
    end

    specify 'should set finance report to not requiring update' do
      service.call(now: call_time)
      finance_report.reload
      expect(finance_report.ready?).to eq(true)
    end
  end

  def expect_finance_report_values(finance_report:, expected_values:)
    expect(finance_report.venue_name).to eq(expected_values.fetch(:venue_name))
    expect(finance_report.staff_member_name).to eq(expected_values.fetch(:staff_member_name))
    expect(finance_report.pay_rate_description).to eq(expected_values.fetch(:pay_rate_description))
    expect(finance_report.accessories_cents).to eq(expected_values.fetch(:accessories_cents))
    expect(finance_report.contains_time_shifted_owed_hours).to eq(expected_values.fetch(:contains_time_shifted_owed_hours))
    expect(finance_report.contains_time_shifted_holidays).to eq(expected_values.fetch(:contains_time_shifted_holidays))
    expect(finance_report.monday_hours_count).to eq(expected_values.fetch(:monday_hours_count))
    expect(finance_report.tuesday_hours_count).to eq(expected_values.fetch(:tuesday_hours_count))
    expect(finance_report.wednesday_hours_count).to eq(expected_values.fetch(:wednesday_hours_count))
    expect(finance_report.thursday_hours_count).to eq(expected_values.fetch(:thursday_hours_count))
    expect(finance_report.friday_hours_count).to eq(expected_values.fetch(:friday_hours_count))
    expect(finance_report.saturday_hours_count).to eq(expected_values.fetch(:saturday_hours_count))
    expect(finance_report.sunday_hours_count).to eq(expected_values.fetch(:sunday_hours_count))
    expect(finance_report.total_hours_count).to eq(expected_values.fetch(:total_hours_count))
    expect(finance_report.owed_hours_minute_count).to eq(expected_values.fetch(:owed_hours_minute_count))
    expect(finance_report.total_cents).to eq(expected_values.fetch(:total_cents))
    expect(finance_report.holiday_days_count).to eq(expected_values.fetch(:holiday_days_count))
    expect(finance_report.requiring_update).to eq(expected_values.fetch(:requiring_update))
    expect(finance_report.current_state).to eq(expected_values.fetch(:current_state))
  end
end
