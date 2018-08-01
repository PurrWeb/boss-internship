require 'rails_helper'

RSpec.describe 'DeleteHoliday service'  do
  let(:now) { Time.current + 1.week }
  let(:start_date) { RotaWeek.new(RotaShiftDate.to_rota_date(now)).start_date }
  let(:end_date) {  RotaWeek.new(RotaShiftDate.to_rota_date(now)).end_date }
  let(:requester) { FactoryGirl.create(:user) }
  let(:holiday) do
    FactoryGirl.create(:holiday, start_date: start_date, end_date: end_date)
  end

  let(:service) do
    DeleteHoliday.new(
      requester: requester,
      holiday: holiday
    )
  end

  context 'before call' do
    specify 'holiday should be enabled' do
      expect(holiday.current_state).to eq('enabled')
    end
  end

  context 'after call' do
    before do
      service.call
    end

    specify 'holiday is disabled' do
      expect(holiday.reload.current_state).to eq('disabled')
    end

    specify 'requester metadata is stored with transition' do
      last_transition = holiday.reload.state_machine.last_transition
      expect(last_transition.metadata["requster_user_id"]).to eq(requester.id)
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
      expect(result.holiday.errors[:base]).to eq(["can't delete holiday that has been frozen"])
    end
  end
end
