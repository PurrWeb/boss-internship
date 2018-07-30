require 'rails_helper'

describe MarkFinanceReportRequiringUpdate do
  include ActiveSupport::Testing::TimeHelpers

  let(:now) { Time.current }
  let(:service) { MarkFinanceReportRequiringUpdate.new(staff_member: staff_member, week: week) }
  let(:staff_member) { FactoryGirl.create(:staff_member)}
  let(:master_venue) { staff_member }
  let(:week) { RotaWeek.new(RotaShiftDate.to_rota_date(now)) }

  context 'when no finance report exists for week' do
    context 'before call' do
      specify 'no reports should exist' do
        staff_member_reports = FinanceReport.where(staff_member: staff_member)
        expect(staff_member_reports.count).to eq(0)
      end
    end

    specify 'it should create a new finance report marked for update' do
      service.call
      staff_member_reports = FinanceReport.where(staff_member: staff_member)
      expect(staff_member_reports.count).to eq(1)

      created_report = FinanceReport.last
      expect(created_report.staff_member).to eq(staff_member)
      expect(created_report.venue).to eq(staff_member.master_venue)
      expect(created_report.week_start).to eq(week.start_date)
      expect(created_report.requiring_update).to eq(true)
      expect(created_report.venue_name).to eq(nil)
      expect(created_report.staff_member_name).to eq(nil)
      expect(created_report.pay_rate_description).to eq(nil)
      expect(created_report.accessories_cents).to eq(nil)
      expect(created_report.contains_time_shifted_owed_hours).to eq(nil)
      expect(created_report.contains_time_shifted_holidays).to eq(nil)
      expect(created_report.monday_hours_count).to eq(nil)
      expect(created_report.tuesday_hours_count).to eq(nil)
      expect(created_report.wednesday_hours_count).to eq(nil)
      expect(created_report.thursday_hours_count).to eq(nil)
      expect(created_report.friday_hours_count).to eq(nil)
      expect(created_report.saturday_hours_count).to eq(nil)
      expect(created_report.sunday_hours_count).to eq(nil)
      expect(created_report.total_hours_count).to eq(nil)
      expect(created_report.owed_hours_minute_count).to eq(nil)
      expect(created_report.total_cents).to eq(nil)
      expect(created_report.holiday_days_count).to eq(nil)
      expect(created_report.current_state).to eq(FinanceReportStateMachine::REQUIRING_UPDATE_STATE.to_s)
    end

    context 'existing ready report exists' do
      before do
        FactoryGirl.create(:finance_report, :create_ready, staff_member: staff_member, venue: staff_member.master_venue)
      end

      context 'before call' do
        specify 'no reports should exist' do
          staff_member_reports = FinanceReport.where(staff_member: staff_member)
          expect(staff_member_reports.count).to eq(1)
          existing_report = FinanceReport.last
          expect(existing_report.current_state).to eq(FinanceReportStateMachine::READY_STATE.to_s)
        end
      end

      specify 'it should not create a new finance report' do
        service.call
        staff_member_reports = FinanceReport.where(staff_member: staff_member)
        expect(staff_member_reports.count).to eq(1)
      end

      specify 'report should now be marked requiring update' do
        service.call
        updated_report = FinanceReport.find_by!(staff_member: staff_member)
        expect(updated_report.current_state).to eq(FinanceReportStateMachine::REQUIRING_UPDATE_STATE.to_s)
      end
    end
  end
end
