require 'rails_helper'

RSpec.describe 'DeleteHoliday service'  do
  let(:now) { Time.current + 1.week }
  let(:today) { RotaShiftDate.to_rota_date(now) }
  let(:current_week) { RotaWeek.new(today) }
  let(:requester) { FactoryGirl.create(:user) }
  let(:existing_finance_report) do
    FactoryGirl.create(
      :finance_report,
      staff_member: staff_member,
      venue: venue,
      week_start: payslip_date
    ).tap do |report|
      report.mark_ready!
    end
  end
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
  let(:service) do
    DeleteHoliday.new(
      requester: requester,
      holiday: holiday
    )
  end

  before do
    holiday
  end

  context 'before call' do
    specify 'holiday should be enabled' do
      expect(holiday.current_state).to eq('enabled')
    end

    specify 'related finance_report exists' do
      expect(FinanceReport.count).to eq(1)
      finance_report = FinanceReport.last
      expect(holiday.finance_report).to eq(finance_report)
      expect(finance_report.ready?).to eq(true)
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

    specify 'related finance_report is marked for update' do
      expect(FinanceReport.count).to eq(1)
      finance_report = FinanceReport.last
      expect(finance_report.requiring_update?).to eq(true)
    end
  end

  context 'holiday is frozen' do
    let(:payslip_date) { RotaWeek.new(start_date).start_date }
    let(:finance_report) do
      FactoryGirl.create(
        :finance_report,
        week_start: payslip_date
      ).tap do |finance_report|
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
        payslip_date: payslip_date,
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
