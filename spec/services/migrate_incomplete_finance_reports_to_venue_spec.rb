require 'rails_helper'

describe MigrateIncompleteFinanceReportsToVenue do
  let(:now) { Time.current }
  let(:today) { RotaShiftDate.to_rota_date(now) }
  let(:start_of_day) { RotaShiftDate.new(today).start_time }
  let(:current_week) { RotaWeek.new(today) }
  let(:service) { MigrateIncompleteFinanceReportsToVenue.new(new_master_venue: new_venue, staff_member: staff_member) }
  let(:call_service) { service.call }
  let(:result) { call_service }
  let(:staff_member) { FactoryGirl.create(:staff_member, master_venue: new_venue) }
  let(:user) { FactoryGirl.create(:user, :admin) }
  let(:new_venue) { FactoryGirl.create(:venue) }
  let(:old_venue) { FactoryGirl.create(:venue) }

  context 'staff member has no finance reports' do
    context 'before call' do
      specify 'no finance report should exist' do
        expect(FinanceReport.count).to eq(0)
      end

      context 'after call' do
        specify 'no finance report should exist' do
          call_service
          expect(FinanceReport.count).to eq(0)
        end
      end
    end
  end

  context 'staff member has completed finance report' do
    let(:complete_finance_report) do
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
    let(:clock_in_day) do
      ClockInDay.create!(
        venue: old_venue,
        date: today,
        staff_member: staff_member,
        creator: user
      )
    end
    let(:existing_hours_acceptance) do
      HoursAcceptancePeriod.create!(
        starts_at: start_of_day,
        ends_at: start_of_day + 2.hours,
        clock_in_day: clock_in_day,
        creator: user,
        finance_report: complete_finance_report
      )
    end

    before do
      complete_finance_report
      existing_hours_acceptance
    end

    context 'before call' do
      specify 'finance report should exist' do
        expect(FinanceReport.count).to eq(1)
        finance_report = FinanceReport.first
        expect(finance_report.done?).to eq(true)
      end

      specify 'finance_report has accosiated hours' do
        expect(existing_hours_acceptance.finance_report).to eq(complete_finance_report)
      end
    end

    context 'after call' do
      specify 'finance report should not be affected' do
        call_service
        expect(FinanceReport.count).to eq(1)
        finance_report = FinanceReport.first
        expect(finance_report.done?).to eq(true)
      end

      specify 'accosiated records should not be affected' do
        call_service
        expect(existing_hours_acceptance.finance_report).to eq(complete_finance_report)
      end
    end
  end

  context 'staff member has incomplete finance reports' do
    let(:incomplete_finance_report_week_start) { current_week.start_date }
    let(:incomplete_finance_report) do
      FactoryGirl.create(
        :finance_report,
        staff_member: staff_member,
        venue: old_venue,
        week_start: incomplete_finance_report_week_start
      ).tap do |report|
        report.mark_ready!
      end
    end

    before do
      incomplete_finance_report
    end

    context 'no associated data' do
      context 'before call' do
        specify 'finance report should exist' do
          expect(FinanceReport.count).to eq(1)

          finance_report = FinanceReport.first
          expect(finance_report.venue).to eq(old_venue)
          expect(finance_report.ready?).to eq(true)
        end
      end

      context 'after call' do
        specify 'incomplete finance report should be deleted' do
          service.call
          expect(FinanceReport.count).to eq(1)
          finance_report = FinanceReport.first

          expect(finance_report).to_not eq(incomplete_finance_report)
        end

        specify 'finance_report should be created for new master venue' do
          service.call
          expect(FinanceReport.count).to eq(1)

          finance_report = FinanceReport.first
          expect(finance_report.venue).to eq(new_venue)
          expect(finance_report.staff_member).to eq(staff_member)
          expect(finance_report.week_start).to eq(incomplete_finance_report_week_start)
          expect(finance_report.requiring_update?).to eq(true)
        end
      end
    end

    context 'hours acceptances exist' do
      let(:clock_in_day) do
        ClockInDay.create!(
          creator: user,
          date: today,
          staff_member: staff_member,
          venue: old_venue
        )
      end
      let(:start_of_shift) { start_of_day }
      let(:end_of_shift) { start_of_day + 2.hours }
      let(:existing_hours_acceptance) do
        HoursAcceptancePeriod.create!(
          creator: user,
          starts_at: start_of_shift,
          ends_at: end_of_shift,
          clock_in_day: clock_in_day,
          finance_report: incomplete_finance_report
        )
      end

      before do
        existing_hours_acceptance
      end

      context 'before call' do
        specify 'hours acceptance is linked to finance report' do
          expect(HoursAcceptancePeriod.count).to eq(1)

          expect(existing_hours_acceptance.finance_report).to eq(incomplete_finance_report)
        end
      end

      context 'after call' do
        specify 'hours acceptance is linked to new finance report' do
          call_service

          existing_hours_acceptance.reload
          new_finance_report = FinanceReport.last
          expect(existing_hours_acceptance.finance_report).to eq(new_finance_report)
          expect(existing_hours_acceptance.finance_report).to_not eq(incomplete_finance_report)
        end
      end
    end

    context 'holidays exist' do
      let(:clock_in_day) do
        ClockInDay.create!(
          creator: user,
          date: today,
          staff_member: staff_member,
          venue: old_venue
        )
      end
      let(:existing_holiday) do
        Holiday.create!(
          staff_member: staff_member,
          payslip_date: current_week.start_date,
          start_date: current_week.start_date,
          end_date: current_week.start_date + 2.days,
          holiday_type: Holiday::PAID_HOLIDAY_TYPE,
          creator: user,
          note: 'foo',
          finance_report: incomplete_finance_report
        )
      end

      before do
        existing_holiday
      end

      context 'before call' do
        specify 'hours acceptance is linked to finance report' do
          expect(Holiday.count).to eq(1)
          expect(existing_holiday.finance_report).to eq(incomplete_finance_report)
        end
      end

      context 'after call' do
        specify 'hours acceptance is linked to new finance report' do
          call_service

          existing_holiday.reload
          new_finance_report = FinanceReport.last
          expect(existing_holiday.finance_report).to eq(new_finance_report)
          expect(existing_holiday.finance_report).to_not eq(incomplete_finance_report)
        end
      end
    end

    context 'owed hours exist' do
      let(:owed_hour_minutes) { 120 }
      let(:owed_hour_day) { today }
      let(:start_of_owed_hour_day) { RotaShiftDate.new(owed_hour_day).start_time }
      let(:owed_hour_starts_at) { start_of_owed_hour_day }
      let(:owed_hour_ends_at) { start_of_owed_hour_day + owed_hour_minutes.minutes }
      let(:existing_owed_hour) do
        OwedHour.create!(
          minutes: owed_hour_minutes,
          note: 'note me',
          require_times: true,
          starts_at: owed_hour_starts_at,
          ends_at: owed_hour_ends_at,
          staff_member: staff_member,
          payslip_date: RotaWeek.new(owed_hour_day).start_date,
          date: owed_hour_day,
          creator: user,
          finance_report: incomplete_finance_report
        )
      end

      before do
        existing_owed_hour
      end

      context 'before call' do
        specify 'hours acceptance is linked to finance report' do
          expect(OwedHour.count).to eq(1)
          expect(existing_owed_hour.finance_report).to eq(incomplete_finance_report)
        end
      end

      context 'after call' do
        specify 'hours acceptance is linked to new finance report' do
          call_service

          existing_owed_hour.reload
          new_finance_report = FinanceReport.last
          expect(existing_owed_hour.finance_report).to eq(new_finance_report)
          expect(existing_owed_hour.finance_report).to_not eq(incomplete_finance_report)
        end
      end
    end

    context 'accesory requests exist' do
      let(:accessory) do
        FactoryGirl.create(
          :accessory,
          venue: old_venue
        )
      end
      let(:existing_accessory_request) do
        AccessoryRequest.create!(
          accessory: accessory,
          staff_member: staff_member,
          price_cents: accessory.price_cents,
          accessory_type: accessory.accessory_type,
          size: accessory.size,
          finance_report: incomplete_finance_report
        )
      end

      before do
        existing_accessory_request
      end

      context 'before call' do
        specify 'hours acceptance is linked to finance report' do
          expect(AccessoryRequest.count).to eq(1)
          expect(existing_accessory_request.finance_report).to eq(incomplete_finance_report)
        end
      end

      context 'after call' do
        specify 'hours acceptance is linked to new finance report' do
          call_service

          existing_accessory_request.reload
          new_finance_report = FinanceReport.last
          expect(existing_accessory_request.finance_report).to eq(new_finance_report)
          expect(existing_accessory_request.finance_report).to_not eq(incomplete_finance_report)
        end
      end
    end

    context 'accesory refund requests exist' do
      let(:accessory) do
        FactoryGirl.create(
          :accessory,
          venue: old_venue
        )
      end
      let(:existing_accessory_request) do
        AccessoryRequest.create!(
          accessory: accessory,
          staff_member: staff_member,
          price_cents: accessory.price_cents,
          accessory_type: accessory.accessory_type,
          size: accessory.size,
          finance_report: incomplete_finance_report
        )
      end
      let(:existing_accessory_refund_request) do
        AccessoryRefundRequest.create!(
          accessory_request: existing_accessory_request,
          staff_member: staff_member,
          price_cents: accessory.price_cents,
          finance_report: incomplete_finance_report
        )
      end

      before do
        existing_accessory_refund_request
      end

      context 'before call' do
        specify 'hours acceptance is linked to finance report' do
          expect(AccessoryRefundRequest.count).to eq(1)
          expect(existing_accessory_refund_request.finance_report).to eq(incomplete_finance_report)
        end
      end

      context 'after call' do
        specify 'hours acceptance is linked to new finance report' do
          call_service

          existing_accessory_refund_request.reload
          new_finance_report = FinanceReport.last
          expect(existing_accessory_refund_request.finance_report).to eq(new_finance_report)
          expect(existing_accessory_refund_request.finance_report).to_not eq(incomplete_finance_report)
        end
      end
    end
  end
end
