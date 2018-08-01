require 'rails_helper'

RSpec.describe 'Edit Holiday service'  do
  let(:requester) { FactoryGirl.create(:user) }
  let(:now) { Time.current + 1.week }
  let(:start_date) { now.beginning_of_week.to_date }
  let(:end_date) { start_date + 2.days }
  let(:holiday) do
    FactoryGirl.create(
      :holiday,
      start_date: start_date,
      end_date: end_date
    )
  end
  let(:staff_member) { holiday.staff_member }
  let(:holiday_params) do
    {
      start_date: holiday.start_date,
      end_date: holiday.end_date,
      payslip_date: holiday.payslip_date,
      holiday_type: holiday.holiday_type,
      note: holiday.note
    }
  end

  let(:service) do
    EditHoliday.new(
      requester: requester,
      holiday: holiday,
      params: holiday_params
    )
  end

  context 'before call' do
    specify 'holiday should be enabled' do
      expect(holiday.current_state).to eq('enabled')
    end

    specify 'holiday should be staff members only holiday' do
      expect(staff_member.active_holidays).to eq([holiday])
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

    describe 'new holiday' do
      let(:new_holiday) { staff_member.reload.active_holidays.first }

      it 'adssda' do
        expect(new_holiday).to be_present
      end

      it 'is parent of old holiday' do
        expect(holiday.reload.parent).to eq(new_holiday)
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
