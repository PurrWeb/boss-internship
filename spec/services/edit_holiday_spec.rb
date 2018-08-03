require 'rails_helper'

RSpec.describe 'Edit Holiday service'  do
  let(:now) { Time.current }
  let(:today) { RotaShiftDate.to_rota_date(now) }
  let(:current_week) { RotaWeek.new(today) }
  let(:requester) { FactoryGirl.create(:user) }
  let(:start_date) { current_week.start_date }
  let(:end_date) { current_week.start_date + 2.days }
  let(:payslip_date) { current_week.start_date }
  let(:holiday) do
    FactoryGirl.create(
      :holiday,
      start_date: start_date,
      end_date: end_date,
      payslip_date: payslip_date,
      finance_report: existing_finance_report,
      staff_member: staff_member
    )
  end
  let(:staff_member) { FactoryGirl.create(:staff_member, master_venue: venue) }
  let(:venue) { FactoryGirl.create(:venue) }
  let(:holiday_params) do
    {
      start_date: holiday.start_date,
      end_date: holiday.end_date,
      payslip_date: holiday.payslip_date,
      holiday_type: holiday.holiday_type,
      note: holiday.note
    }
  end
  let(:existing_finance_report) do
    FactoryGirl.create(
      :finance_report,
      staff_member: staff_member,
      venue: venue,
      week_start: current_week.start_date
    ).tap do |report|
      report.mark_ready!
    end
  end

  let(:service) do
    EditHoliday.new(
      requester: requester,
      holiday: holiday,
      params: holiday_params
    )
  end

  before do
    holiday
  end

  context 'before call' do
    specify 'holiday should be enabled' do
      expect(holiday.current_state).to eq('enabled')
    end

    specify 'holiday should be staff members only holiday' do
      expect(staff_member.active_holidays).to eq([holiday])
    end

    specify 'finance report should exist' do
      expect(FinanceReport.count).to eq(1)
      finance_report = FinanceReport.last
      expect(holiday.finance_report).to eq(finance_report)
      expect(finance_report.ready?).to eq(true)
    end
  end

  context 'supplying unknown holiday param' do
    let(:holiday_params) do
      {
        start_date: holiday.start_date,
        end_date: holiday.end_date,
        payslip_date: holiday.payslip_date,
        holiday_type: holiday.holiday_type,
        foo: 'asdsa'
      }
    end

    specify 'it throws an argument error' do
      expect{ service.call }.to raise_error(ArgumentError)
    end
  end

  context 'supplying too few holiday params' do
    let(:holiday_params) do
      {
        start_date: holiday.start_date,
        holiday_type: holiday.holiday_type
      }
    end

    specify 'it throws an argument error' do
      expect{ service.call }.to raise_error(ArgumentError)
    end
  end

  context 'attributes have not changed' do
    let(:result) { service.call }
    before do
      result
    end

    describe 'result' do
      it 'should be' do
        expect(result).to be_success
      end
    end

    specify 'holiday remains enabled' do
      expect(holiday.reload.current_state).to eq('enabled')
    end

    specify 'no new holiday should be created' do
      expect(staff_member.reload.active_holidays.count).to eq(1)
    end
  end

  context 'holiday params have changed' do
    let(:holiday_params) do
      {
        start_date: holiday.start_date + 1.day,
        end_date: holiday.end_date + 1.day,
        payslip_date: holiday.payslip_date + 1.week,
        holiday_type: holiday.holiday_type,
        note: holiday.note
      }
    end
    let(:result) { service.call }

    before do
      result
    end

    it 'should be a success' do
      expect(result).to be_success
    end

    specify 'holiday is disabled' do
      expect(holiday.reload.current_state).to eq('disabled')
    end

    specify 'requester metadata is stored with transition' do
      last_transition = holiday.reload.state_machine.last_transition
      expect(last_transition.metadata["requster_user_id"]).to eq(requester.id)
    end

    specify 'staff member has a new active holiday' do
      expect(staff_member.reload.active_holidays.count).to eq(1)
    end

    specify 'should create new finance report and mark for update' do
      expect(FinanceReport.count).to eq(2)
      finance_report = FinanceReport.last
      expect(finance_report).to_not eq(existing_finance_report)
      expect(finance_report.requiring_update?).to eq(true)
    end

    describe 'new holiday' do
      let(:new_holiday) { staff_member.reload.active_holidays.first }

      it 'should be present' do
        expect(new_holiday).to be_present
      end

      it 'is parent of old holiday' do
        expect(holiday.reload.parent).to eq(new_holiday)
      end

      specify 'should be associated with new finance report' do
        finance_report = FinanceReport.last
        expect(new_holiday.finance_report).to eq(finance_report)
      end
    end
  end

  context 'params are invalid' do
    let(:holiday_params) do
      {
        start_date: nil,
        end_date: holiday.end_date,
        payslip_date: holiday.payslip_date,
        holiday_type: holiday.holiday_type,
        note: holiday.note
      }
    end
    let(:result) { service.call }

    before do
      result
    end

    it 'should not be a success' do
      expect(result).to_not be_success
    end

    specify 'holiday remains enabled' do
      expect(holiday.reload.current_state).to eq('enabled')
    end

    specify 'no new holiday should be created' do
      expect(staff_member.reload.active_holidays.count).to eq(1)
    end

    specify 'it should return the error' do
      expect(result.holiday.errors.keys).to eq([:start_date])
    end
  end

  context 'holiday is frozen' do
    let(:finance_report) do
      FactoryGirl.create(:finance_report).tap do |finance_report|
        finance_report.mark_ready!
        finance_report.allow_mark_completed = true
        finance_report.mark_completed!
      end
    end
    let(:holiday) do
      FactoryGirl.create(
        :holiday,
        start_date: start_date,
        end_date: end_date,
        finance_report: finance_report
      )
    end
    let(:result) { service.call }

    before do
      result
    end

    it 'should not be a success' do
      expect(result).to_not be_success
    end

    specify 'it should return base error' do
      expect(result.holiday.errors[:base]).to eq(['holiday is not editable'])
    end
  end
end
