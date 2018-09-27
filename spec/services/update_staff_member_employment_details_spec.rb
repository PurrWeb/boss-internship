require 'rails_helper'

describe UpdateStaffMemberEmploymentDetails do
  let(:now) { Time.current }
  let(:today) { RotaShiftDate.to_rota_date(now) }
  let(:start_of_day) { RotaShiftDate.new(today).start_time }
  let(:current_week) { RotaWeek.new(today) }
  let(:call_time) { start_of_day + 10.hours }
  let(:user) { FactoryGirl.create(:user) }
  let(:old_venue) { FactoryGirl.create(:venue) }
  let(:old_pay_rate_cents) { 200 }
  let(:old_pay_rate) do
    FactoryGirl.create(:pay_rate, :hourly, cents: old_pay_rate_cents)
  end
  let(:sage_id) { 'SAGE_ID' }
  let(:staff_member) do
    FactoryGirl.create(
      :staff_member,
      master_venue: old_venue,
      pay_rate: old_pay_rate,
      sage_id: sage_id
    )
  end
  let(:service) do
    UpdateStaffMemberEmploymentDetails.new(
      requester: user,
      staff_member: staff_member,
      params: update_params,
      migrate_finance_report_venue_service: migrate_finance_report_venue_service
    )
  end
  let(:migrate_finance_report_venue_service) { MigrateIncompleteFinanceReportsToVenue }
  let(:call_service) { service.call(now: call_time) }
  let(:result) { call_service }

  context 'updating payrate' do
    let(:new_pay_rate_cents) { 100 }
    let(:new_pay_rate) do
      FactoryGirl.create(:pay_rate, :hourly, cents: new_pay_rate_cents)
    end
    let(:update_params) do
      {
        pay_rate: new_pay_rate
      }
    end

    it 'should succceed' do
      call_service
      expect(result.success?).to eq(true)
    end

    it 'should update the pay rate' do
      call_service
      expect(result.staff_member.pay_rate).to eq(new_pay_rate)
    end

    context 'incomplete finance reports exist' do
      let(:previous_week) do
        RotaWeek.new(today - 1.week)
      end
      let(:previous_week_finance_report) do
        FactoryGirl.create(
          :finance_report,
          staff_member: staff_member,
          venue: old_venue,
          week_start: previous_week.start_date
        ).tap do |report|
          report.mark_ready!
        end
      end
      let(:previous_week2)  do
        RotaWeek.new(today - 2.weeks)
      end
      let(:previous_week2_finance_report) do
        FactoryGirl.create(
          :finance_report,
          staff_member: staff_member,
          venue: old_venue,
          week_start: previous_week2.start_date
        ).tap do |report|
          report.mark_ready!
        end
      end
      let(:current_week_finance_report) do
        FactoryGirl.create(
          :finance_report,
          staff_member: staff_member,
          venue: old_venue,
          week_start: current_week.start_date
        ).tap do |report|
          report.mark_ready!
          report.allow_mark_completed = true
          report.mark_completed!
        end
      end
      let(:existing_finance_reports) do
        [
          current_week_finance_report,
          previous_week_finance_report,
          previous_week2_finance_report
        ]
      end

      before do
        previous_week_finance_report
        previous_week2_finance_report
        current_week_finance_report
      end

      context 'before call' do
        specify 'finance reports should exist' do
          expect(FinanceReport.count).to eq(3)
          existing_finance_reports.each(&:reload)

          expect(current_week_finance_report.done?).to eq(true)
          expect(previous_week_finance_report.ready?).to eq(true)
          expect(previous_week2_finance_report.ready?).to eq(true)
        end
      end

      context 'after call' do
        it 'should mark all ready finance reports for update' do
          call_service
          existing_finance_reports.each(&:reload)

          expect(current_week_finance_report.done?).to eq(true)
          expect(previous_week_finance_report.requiring_update?).to eq(true)
          expect(previous_week2_finance_report.requiring_update?).to eq(true)
        end
      end
    end
  end

  context 'updating master venue' do
    let(:new_master_venue) { FactoryGirl.create(:venue) }
    let(:update_params) do
      {
        master_venue: new_master_venue
      }
    end
    let(:migrate_finance_report_venue_service) { double('migrate finance report venue service') }
    let(:migrate_finance_report_venue_service_instance) { double('migrate finance report venue service instance') }

    before do
      allow(migrate_finance_report_venue_service).to receive(:new).and_return(migrate_finance_report_venue_service_instance)
      allow(migrate_finance_report_venue_service_instance).to receive(:call)
    end

    context 'before call' do
      specify 'sage id should be set' do
        expect(staff_member.sage_id).to eq(sage_id)
      end
    end

    it 'should succceed' do
      call_service
      expect(result.success?).to eq(true)
    end

    it 'should update the pay rate' do
      call_service
      expect(result.staff_member.master_venue).to eq(new_master_venue)
    end

    it 'should clear the staff members sage id' do
      call_service
      expect(staff_member.reload.sage_id).to eq(nil)
    end

    context 'incomplete finance reports exist' do
      let(:previous_week) do
        RotaWeek.new(today - 1.week)
      end
      let(:previous_week_finance_report) do
        FactoryGirl.create(
          :finance_report,
          staff_member: staff_member,
          venue: old_venue,
          week_start: previous_week.start_date
        ).tap do |report|
          report.mark_ready!
        end
      end
      let(:previous_week2)  do
        RotaWeek.new(today - 2.weeks)
      end
      let(:previous_week2_finance_report) do
        FactoryGirl.create(
          :finance_report,
          staff_member: staff_member,
          venue: old_venue,
          week_start: previous_week2.start_date
        ).tap do |report|
          report.mark_ready!
        end
      end
      let(:current_week_finance_report) do
        FactoryGirl.create(
          :finance_report,
          staff_member: staff_member,
          venue: old_venue,
          week_start: current_week.start_date
        ).tap do |report|
          report.mark_ready!
          report.allow_mark_completed = true
          report.mark_completed!
        end
      end
      let(:existing_finance_reports) do
        [
          current_week_finance_report,
          previous_week_finance_report,
          previous_week2_finance_report
        ]
      end

      before do
        previous_week_finance_report
        previous_week2_finance_report
        current_week_finance_report
      end

      context 'before call' do
        specify 'finance reports should exist' do
          expect(FinanceReport.count).to eq(3)

          expect(current_week_finance_report.done?).to eq(true)
          expect(previous_week_finance_report.ready?).to eq(true)
          expect(previous_week2_finance_report.ready?).to eq(true)
        end
      end

      context 'after call' do
        it 'should destroy non complete finance reports' do
          call_service

          expect(current_week_finance_report.reload.done?).to eq(true)
          expect(previous_week_finance_report).to be_present
          expect(previous_week2_finance_report).to be_present
        end

        it 'should migrate finance reports' do
          expect(migrate_finance_report_venue_service).to receive(:new).with({
            staff_member: staff_member,
            new_master_venue: new_master_venue,
            nested: true
          }).and_return(migrate_finance_report_venue_service_instance)
          expect(migrate_finance_report_venue_service_instance).to receive(:call)

          call_service

          expect(FinanceReport.count).to eq(3)
        end
      end
    end
  end
end
