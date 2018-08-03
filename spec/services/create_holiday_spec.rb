require 'rails_helper'

describe CreateHoliday do
  let(:now) { Time.current }
  let(:today) { RotaShiftDate.to_rota_date(now) }
  let(:current_week) { RotaWeek.new(today) }
  let(:call_time) { now }
  let(:venue) { FactoryGirl.create(:venue) }
  let(:staff_member) { FactoryGirl.create(:staff_member, master_venue: venue) }
  let(:user) { FactoryGirl.create(:user) }
  let(:service) { CreateHoliday.new(requester: user, params: create_params) }
  let(:call_service) { service.call }
  let(:holiday_duration) { 2.days }
  let(:start_date) { current_week.start_date }
  let(:end_date) { current_week.start_date + holiday_duration }
  let(:payslip_date) { current_week.start_date }
  let(:holiday_type) { Holiday::PAID_HOLIDAY_TYPE }
  let(:create_params) do
    {
      creator: user,
      staff_member: staff_member,
      start_date: start_date,
      end_date:  end_date,
      payslip_date: payslip_date,
      holiday_type: holiday_type
    }
  end

  context 'before call' do
    specify 'no holidays should exist' do
      expect(
        Holiday.count
      ).to eq(0)
    end

    specify 'no finance reports should exist' do
      expect(
        FinanceReport.count
      ).to eq(0)
    end
  end

  it 'should succeed' do
    result = call_service
    expect(result.success?).to eq(true)
  end

  it 'should create holiday' do
    call_service
    expect(
      Holiday.count
    ).to eq(1)
  end

  describe 'holiday' do
    it 'should have correct values' do
      call_service
      holiday = Holiday.last
      expect(holiday.creator).to eq(user)
      expect(holiday.staff_member).to eq(staff_member)
      expect(holiday.start_date).to eq(start_date)
      expect(holiday.end_date).to eq(end_date)
      expect(holiday.payslip_date).to eq(payslip_date)
      expect(holiday.holiday_type).to eq(holiday_type)
    end
  end

  it 'should create finance_report' do
    call_service
    expect(FinanceReport.count).to eq(1)
    finance_report = FinanceReport.last
    expect(finance_report.staff_member).to eq(staff_member)
    expect(finance_report.venue).to eq(staff_member.master_venue)
    expect(finance_report.week_start).to eq(current_week.start_date)
    expect(finance_report.requiring_update?).to eq(true)
  end
end
