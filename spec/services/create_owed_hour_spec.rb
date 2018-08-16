require 'rails_helper'

describe CreateOwedHour do
  let(:now) { Time.current }
  let(:today) { RotaShiftDate.to_rota_date(now) }
  let(:current_week) { RotaWeek.new(today) }
  let(:call_time) { now }
  let(:staff_member) { FactoryGirl.create(:staff_member) }
  let(:user) { FactoryGirl.create(:user) }
  let(:service) { CreateOwedHour.new(params: params) }
  let(:call_service) { service.call(now: call_time) }
  let(:result) { call_service }

  context 'before call' do
    specify 'no owed hour should exist' do
      expect(OwedHour.count).to eq(0)
    end
  end

  context 'valid_params supplied' do
    let(:owed_hour_duration_minutes) { 300 }
    let(:owed_hour_date) { today - 2.weeks }
    let(:start_of_owed_hour_day) { RotaShiftDate.new(owed_hour_date).start_time }
    let(:owed_hour_starts_at) { start_of_owed_hour_day }
    let(:owed_hour_ends_at) { start_of_owed_hour_day + owed_hour_duration_minutes.minutes }
    let(:expected_owed_hour_payslip_date) { current_week.start_date }
    let(:owed_hour_note) { 'This is a note' }
    let(:params) do
      {
        staff_member: staff_member,
        date: owed_hour_date,
        starts_at: owed_hour_starts_at,
        ends_at: owed_hour_ends_at,
        minutes: owed_hour_duration_minutes,
        note: owed_hour_note,
        payslip_date: expected_owed_hour_payslip_date,
        creator: user
      }
    end

    it 'should be success' do
      expect(result.success?).to eq(true)
    end

    it 'should create the owed hour' do
      result = call_service
      expect(OwedHour.count).to eq(1)

      owed_hour = result.owed_hour
      expect(owed_hour).to eq(OwedHour.first)
      expect(owed_hour.staff_member).to eq(staff_member)
      expect(owed_hour.date).to eq(owed_hour_date)
      expect(owed_hour.starts_at).to eq(owed_hour_starts_at)
      expect(owed_hour.ends_at).to eq(owed_hour_ends_at)
      expect(owed_hour.minutes).to eq(owed_hour_duration_minutes)
      expect(owed_hour.note).to eq(owed_hour.note)
      expect(owed_hour.payslip_date).to eq(expected_owed_hour_payslip_date)
    end

    context 'no finance report exists before call for week' do
      it 'should create finance report marked for update' do
        expect(
          FinanceReport.where(staff_member: staff_member).count
        ).to eq(0)
        result = call_service
        expect(
          FinanceReport.where(staff_member: staff_member).count
        ).to eq(1)
        finance_report = FinanceReport.where(staff_member: staff_member).first
        owed_hour = result.owed_hour

        expect(finance_report.week_start).to eq(current_week.start_date)
        expect(finance_report.venue).to eq(staff_member.master_venue)
        expect(finance_report.requiring_update?).to eq(true)
        expect(owed_hour.finance_report).to eq(finance_report)
      end
    end

    context 'finance report exists before call for week' do
      before do
        existing_finance_report
      end

      context 'finance report is incomplete' do
        let(:existing_finance_report) do
          finance_report = FactoryGirl.create(:finance_report, {
            staff_member: staff_member,
            venue: staff_member.master_venue
          })
          finance_report.mark_incomplete!
          finance_report
        end

        context 'before call' do
          it 'should be marked incomplete' do
            expect(existing_finance_report.incomplete?).to eq(true)
          end
        end

        it 'should be success' do
          expect(result.success?).to eq(true)
        end

        it 'should create the owed hour' do
          result = call_service
          expect(OwedHour.count).to eq(1)

          owed_hour = result.owed_hour
          expect(owed_hour).to eq(OwedHour.first)
          expect(owed_hour.staff_member).to eq(staff_member)
          expect(owed_hour.date).to eq(owed_hour_date)
          expect(owed_hour.starts_at).to eq(owed_hour_starts_at)
          expect(owed_hour.ends_at).to eq(owed_hour_ends_at)
          expect(owed_hour.minutes).to eq(owed_hour_duration_minutes)
          expect(owed_hour.note).to eq(owed_hour.note)
          expect(owed_hour.payslip_date).to eq(expected_owed_hour_payslip_date)
        end

        it 'should create finance report marked for update' do
          expect(
            FinanceReport.where(staff_member: staff_member).count
          ).to eq(1)
          result = call_service
          expect(
            FinanceReport.where(staff_member: staff_member).count
          ).to eq(1)
          finance_report = FinanceReport.where(staff_member: staff_member).first
          expect(finance_report.id).to eq(existing_finance_report.id)
          owed_hour = result.owed_hour

          expect(finance_report.week_start).to eq(current_week.start_date)
          expect(finance_report.venue).to eq(staff_member.master_venue)
          expect(finance_report.requiring_update?).to eq(true)
          expect(owed_hour.finance_report).to eq(finance_report)
        end
      end

      context 'finance report completed' do
        let(:existing_finance_report) do
          finance_report = FactoryGirl.create(:finance_report, {
            staff_member: staff_member,
            venue: staff_member.master_venue
          })
          finance_report.mark_ready!
          finance_report.allow_mark_completed = true
          finance_report.mark_completed!
          finance_report
        end

        context 'before call' do
          it 'should be marked incomplete' do
            expect(existing_finance_report.done?).to eq(true)
          end
        end

        it 'should throw error' do
          expect{ call_service  }.to raise_error("Attempt to mark comepleted finance report #{existing_finance_report.id} requiring update")
        end

        it 'should not create the owed hour' do
          begin
            call_service
          rescue; end
          expect(OwedHour.count).to eq(0)
        end

        it 'should not update finance report' do
          expect(
            FinanceReport.where(staff_member: staff_member).count
          ).to eq(1)
          begin
            call_service
          rescue; end
          expect(
            FinanceReport.where(staff_member: staff_member).count
          ).to eq(1)
          existing_finance_report.reload
          expect(existing_finance_report.done?).to eq(true)
        end
      end
    end
  end
end
