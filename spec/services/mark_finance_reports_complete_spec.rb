require 'rails_helper'

describe MarkFinanceReportsComplete do
  include ActiveSupport::Testing::TimeHelpers

  let(:now) { Time.current }
  let(:finance_report_create_time) { now - 2.weeks }
  let(:user) { FactoryGirl.create(:user) }
  let(:staff_member) { FactoryGirl.create(:staff_member) }
  let(:service) do
    MarkFinanceReportsComplete.new(finance_reports: finance_reports)
  end
  let(:call_service) { service.call }

  context 'valid ready finance report is supplied' do
    let(:finance_report) do
      travel_to finance_report_create_time do
        FactoryGirl.create(:finance_report, staff_member: staff_member, venue: staff_member.master_venue).tap do |fr|
          fr.mark_ready!
        end
      end
    end
    let(:finance_reports) { [finance_report] }

    specify 'it should complete finance report' do
      call_service
      expect(finance_report.reload.done?).to eq(true)
    end
  end

  context 'requiring update finance report is supplied' do
    let(:finance_report) do
      travel_to finance_report_create_time do
        FactoryGirl.create(:finance_report, staff_member: staff_member, venue: staff_member.master_venue)
      end
    end
    let(:finance_reports) { [finance_report] }

    it 'should raise error' do
      expect {
        call_service
      }.to raise_error(
        MarkFinanceReportsComplete.incompletable_report_attempt_error_message(staff_member_ids: finance_reports.map{|fr| fr.staff_member.id})
      )
    end

    specify 'finance report should not be completed' do
      begin
        call_service
      rescue
        #swallow errors
      end
      expect(finance_report.reload.done?).to eq(false)
    end
  end

  context 'early finance report is supplied' do
    let(:finance_report) do
      FactoryGirl.create(:finance_report, staff_member: staff_member, venue: staff_member.master_venue).tap do |fr|
        fr.mark_ready!
      end
    end
    let(:finance_reports) { [finance_report] }

    it 'should raise error' do
      expect {
        call_service
      }.to raise_error(
        MarkFinanceReportsComplete.incompletable_report_attempt_error_message(
          staff_member_ids: finance_reports.map{ |fr| fr.staff_member.id }
        )
      )
    end

    specify 'finance report should not be completed' do
      begin
        call_service
      rescue
        #swallow errors
      end
      expect(finance_report.reload.done?).to eq(false)
    end
  end

  context 'complete finance report is supplied' do
    let(:finance_report) do
      travel_to finance_report_create_time do
        FactoryGirl.create(:finance_report, staff_member: staff_member, venue: staff_member.master_venue).tap do |fr|
          fr.mark_ready!
          fr.allow_mark_completed = true
          fr.mark_completed!
        end
      end
    end
    let(:finance_reports) { [finance_report] }

    it 'should raise error' do
      expect {
        call_service
      }.to raise_error(
        MarkFinanceReportsComplete.incompletable_report_attempt_error_message(
          staff_member_ids: finance_reports.map{ |fr| fr.staff_member.id }
        )
      )
    end

    specify 'finance report should stay completed' do
      begin
        call_service
      rescue
        #swallow errors
      end
      expect(finance_report.reload.done?).to eq(true)
    end
  end

  context 'incomplete ready finance report is supplied' do
    let(:finance_report) do
      travel_to finance_report_create_time do
        FactoryGirl.create(:finance_report, staff_member: staff_member, venue: staff_member.master_venue)
      end
    end
    let(:finance_reports) { [finance_report] }

    it 'should raise error' do
      expect {
        call_service
      }.to raise_error(
        MarkFinanceReportsComplete.incompletable_report_attempt_error_message(staff_member_ids: finance_reports.map{|fr| fr.staff_member.id})
      )
    end

    specify 'finance report should not be completed' do
      begin
        call_service
      rescue
        #swallow errors
      end
      expect(finance_report.reload.done?).to eq(false)
    end
  end

  context 'negative ready! finance report is supplied' do
    let(:accessory) { FactoryGirl.create(:accessory) }
    let(:accessory_request) do
      AccessoryRequest.create!(
        accessory_type: accessory.accessory_type,
        price_cents: accessory.price_cents,
        staff_member: staff_member,
        size: accessory.size,
        accessory: accessory,
        finance_report: nil,
        payslip_date: nil
      )
    end
    let(:finance_report) do
      result = nil
      travel_to finance_report_create_time do
        result = FactoryGirl.create(:finance_report, staff_member: staff_member, venue: staff_member.master_venue).tap do |fr|
          fr.mark_ready!
          accessory_request.update_attributes!(
            finance_report: fr
          )
          accessory_request.state_machine.transition_to!(:accepted)
          accessory_request.state_machine.transition_to!(:completed)
          accessory_request.update_attributes!(payslip_date: fr.week_start)
        end
        UpdateFinanceReportData.new(
          requester: user,
          finance_report: result
        ).call
      end
      result
    end
    let(:finance_reports) { [finance_report] }

    before do
      accessory_request
      finance_report
    end

    context 'before call' do
      specify 'finance report should be linked to accessory request' do
        expect(accessory_request.reload.finance_report).to eq(finance_report)
      end

      specify 'finance report should be ready' do
        expect(finance_report.ready?).to eq(true)
      end

      specify 'finance report should be negative' do
        expect(finance_report.total_cents).to be < (0)
      end

      specify 'finance report should not exist for the next week' do
        expect(
          FinanceReport.find_by(
            staff_member: staff_member,
            week_start: finance_report.week_start + 1.week,
            venue: finance_report.venue
          )
        ).to_not be_present
      end
    end

    specify 'finance report should complete' do
      call_service
      expect(finance_report.reload.done?).to eq(true)
    end

    it 'should set report total to zero' do
      call_service
      expect(finance_report.reload.done?).to eq(true)
    end

    it 'should create finance report for next week' do
      call_service
      expect(
        FinanceReport.find_by(
          staff_member: staff_member,
          week_start: finance_report.week_start + 1.week,
          venue: finance_report.venue
        )
      ).to be_present
    end

    it 'should move accessory into next weeks finance report' do
      call_service
      expect(
        accessory_request.reload.payslip_date
      ).to eq(
        finance_report.week_start + 1.week
      )
    end
  end

  context 'multiple finance reports are supplied' do
    let(:finance_reports) do
      travel_to finance_report_create_time do
        Array.new(2) do |index|
          FactoryGirl.create(:finance_report, staff_member: staff_member, venue: staff_member.master_venue).tap do |fr|
            fr.mark_ready!
          end
        end
      end
    end

    specify do
      call_service
      expect(finance_reports.all?{ |fr| fr.done? }).to eq(true)
    end
  end
end
