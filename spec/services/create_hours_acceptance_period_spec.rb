require 'rails_helper'

describe CreateHoursAcceptancePeriod do
  let(:now) { Time.current }
  let(:today) { RotaShiftDate.to_rota_date(now) }
  let(:start_of_day) { RotaShiftDate.new(today).start_time }
  let(:current_week) { RotaWeek.new(today) }
  let(:staff_member) { FactoryGirl.create(:staff_member, master_venue: venue) }
  let(:user) { FactoryGirl.create(:user) }
  let(:venue) { FactoryGirl.create(:venue) }
  let(:service) do
    CreateHoursAcceptancePeriod.new(
      requester: requester,
      staff_member: staff_member,
      venue: venue,
      date: today,
      starts_at: starts_at,
      ends_at: ends_at,
      status: status,
      breaks: breaks_data,
      reason_note: reason_note,
    )
  end
  let(:call_time) { start_of_day + 10.hours }
  let(:call_service) { result }
  let(:result) { service.call(now: call_time) }
  let(:shift_duration_hours) { 8 }
  let(:starts_at) { start_of_day }
  let(:status) { HoursAcceptancePeriod::ACCEPTED_STATE }
  let(:date) { today }
  let(:ends_at) { start_of_day + shift_duration_hours.hours }
  let(:break_starts_at) { start_of_day + 2.hours }
  let(:break_ends_at) { break_starts_at + 1.hour }
  let(:reason_note) { 'reason_note' }
  let(:requester) { user }
  let(:breaks_data) do
    [
      HoursAcceptanceBreak.new(
        starts_at: break_starts_at,
        ends_at: break_ends_at
      )
    ]
  end

  context "when HoursAcceptancePeriod starts_at has a seconds" do
    context 'before call' do
      specify 'no periods should exist' do
        expect(HoursAcceptancePeriod.count).to eq(0)
      end

      specify 'no breaks should exist' do
        expect(HoursAcceptancePeriod.count).to eq(0)
      end
    end

    context 'after call' do
      let(:starts_at) { start_of_day + 2.hours + 10.seconds }

      it "shouldn't succeed" do
        call_service
        expect(result.success?).to_not eq(true)
      end

      it "should return error message" do
        errors = result.api_errors.errors
        expect(errors[:startsAt]).to eq(["must be a minute"])
      end

      it "should not create a period" do
        call_service
        expect(HoursAcceptancePeriod.count).to eq(0)
      end

      it "should not create a breaks" do
        call_service
        expect(HoursAcceptanceBreak.count).to eq(0)
      end
    end
  end

  context "when HoursAcceptancePeriod ends_at has a seconds" do
    context 'before call' do
      specify 'no periods should exist' do
        expect(HoursAcceptancePeriod.count).to eq(0)
      end

      specify 'no breaks should exist' do
        expect(HoursAcceptancePeriod.count).to eq(0)
      end
    end

    context 'after call' do
      let(:ends_at) { start_of_day + shift_duration_hours.hours + 10.seconds }

      it "shouldn't succeed" do
        call_service
        expect(result.success?).to_not eq(true)
      end

      it "should return error message" do
        errors = result.api_errors.errors
        expect(errors[:endsAt]).to eq(["must be a minute"])
      end

      it "should not create a period" do
        call_service
        expect(HoursAcceptancePeriod.count).to eq(0)
      end

      it "should not create a breaks" do
        call_service
        expect(HoursAcceptanceBreak.count).to eq(0)
      end
    end
  end

  context "when HoursAcceptanceBreak starts_at has a seconds" do
    context 'before call' do
      specify 'no periods should exist' do
        expect(HoursAcceptancePeriod.count).to eq(0)
      end

      specify 'no breaks should exist' do
        expect(HoursAcceptancePeriod.count).to eq(0)
      end
    end

    context 'after call' do
      let(:break_starts_at) { start_of_day + 2.hours + 10.seconds }

      it "shouldn't succeed" do
        call_service
        expect(result.success?).to_not eq(true)
      end

      it "should return error message" do
        breaks_errors = result.api_errors.errors[:breaks]
        expect(breaks_errors.first[:startsAt]).to eq(["must be a minute"])
      end

      it "should not create a period" do
        call_service
        expect(HoursAcceptancePeriod.count).to eq(0)
      end

      it "should not create a breaks" do
        call_service
        expect(HoursAcceptanceBreak.count).to eq(0)
      end
    end
  end

  context "when HoursAcceptanceBreak ends_at has a seconds" do
    context 'before call' do
      specify 'no periods should exist' do
        expect(HoursAcceptancePeriod.count).to eq(0)
      end

      specify 'no breaks should exist' do
        expect(HoursAcceptancePeriod.count).to eq(0)
      end
    end

    context 'after call' do
      let(:break_ends_at) { break_starts_at + 1.hour + 10.seconds }

      it "shouldn't succeed" do
        call_service
        expect(result.success?).to_not eq(true)
      end

      it "should return error message" do
        breaks_errors = result.api_errors.errors[:breaks]
        expect(breaks_errors.first[:endsAt]).to eq(["must be a minute"])
      end

      it "should not create a period" do
        call_service
        expect(HoursAcceptancePeriod.count).to eq(0)
      end

      it "should not create a breaks" do
        call_service
        expect(HoursAcceptanceBreak.count).to eq(0)
      end
    end
  end

  context 'no finance report exists' do
    context 'before call' do
      specify 'no periods should exist' do
        expect(HoursAcceptancePeriod.count).to eq(0)
      end

      specify 'no breaks should exist' do
        expect(HoursAcceptancePeriod.count).to eq(0)
      end
    end

    context 'after call' do
      it 'should succeed' do
        call_service
        expect(result.success?).to eq(true)
      end

      it 'should create the hours acceptance period' do
        call_service
        expect(HoursAcceptancePeriod.count).to eq(1)
        hours_acceptance_period = HoursAcceptancePeriod.first
        expect(hours_acceptance_period.staff_member).to eq(staff_member)
        expect(hours_acceptance_period.venue).to eq(venue)
        expect(hours_acceptance_period.date).to eq(date)
        expect(hours_acceptance_period.starts_at).to eq(starts_at)
        expect(hours_acceptance_period.ends_at).to eq(ends_at)
        expect(hours_acceptance_period.status).to eq(status)
        expect(hours_acceptance_period.reason_note).to eq(reason_note)
      end

      it 'should create a break' do
        call_service

        expect(HoursAcceptanceBreak.count).to eq(1)
        hours_acceptance_break = HoursAcceptanceBreak.first
        expect(hours_acceptance_break.starts_at).to eq(break_starts_at)
        expect(hours_acceptance_break.ends_at).to eq(break_ends_at)
      end

      context 'when status is accepted' do
        let(:status) { HoursAcceptancePeriod::ACCEPTED_STATE }

        it 'should create finance report' do
          call_service

          expect(FinanceReport.count).to eq(1)
          finance_report = FinanceReport.first
          expect(finance_report.staff_member).to eq(staff_member)
          expect(finance_report.venue).to eq(staff_member.master_venue)
          expect(finance_report.week_start).to eq(current_week.start_date)
          expect(finance_report.requiring_update?).to eq(true)

          hours_acceptance_period = result.hours_acceptance_period
          expect(hours_acceptance_period.finance_report).to eq(finance_report)
        end
      end

      context 'when status is not accepted' do
        let(:status) { HoursAcceptancePeriod::PENDING_STATE }

        it 'should note create finance report' do
          call_service

          expect(FinanceReport.count).to eq(0)
        end
      end
    end
  end

  context 'ready finance report exists' do
    let(:existing_finance_report) do
      FactoryGirl.create(
        :finance_report,
        staff_member: staff_member,
        venue: staff_member.master_venue,
        week_start: current_week.start_date
      ).tap do |report|
        report.mark_ready!
      end
    end

    before do
      existing_finance_report
    end

    context 'before call' do
      specify 'no periods should exist' do
        expect(HoursAcceptancePeriod.count).to eq(0)
      end

      specify 'no breaks should exist' do
        expect(HoursAcceptancePeriod.count).to eq(0)
      end

      specify 'ready finance report exists' do
        expect(FinanceReport.count).to eq(1)

        finance_report = FinanceReport.first
        expect(finance_report.ready?).to eq(true)
      end
    end

    context 'after call' do
      context 'when status is not accepted' do
        let(:status) { HoursAcceptancePeriod::PENDING_STATE }

        it 'should not succeed' do
          expect(result.success?).to eq(true)
        end

        it 'should not change finance report' do
          call_service

          expect(FinanceReport.count).to eq(1)
          finance_report = FinanceReport.first
          expect(finance_report.ready?).to eq(true)
        end
      end

      context 'when status is accepted' do
        let(:status) { HoursAcceptancePeriod::ACCEPTED_STATE }

        it 'should not succeed' do
          expect(result.success?).to eq(true)
        end

        it 'should mark report for update' do
          call_service

          expect(FinanceReport.count).to eq(1)
          finance_report = FinanceReport.first
          expect(finance_report.requiring_update?).to eq(true)
        end

        it 'should associate report with hours_acceptance_period' do
          call_service

          hours_acceptance_period = call_service.hours_acceptance_period
          expect(hours_acceptance_period.finance_report).to eq(existing_finance_report)
        end
      end
    end
  end
end
