require 'rails_helper'

describe UpdateVenue do
  let(:now) { Time.current }
  let(:today) { RotaShiftDate.to_rota_date(now) }
  let(:start_of_day) { RotaShiftDate.new(today).start_time }
  let(:current_week) { RotaWeek.new(today) }
  let(:call_time) { start_of_day + 10.hours }
  let(:old_name) { 'old_name' }
  let(:venue) do
    FactoryGirl.create(
      :venue,
      name: old_name
    )
  end
  let(:staff_member) do
    FactoryGirl.create(
      :staff_member,
      master_venue: venue
    )
  end
  let(:reminder_users) { [] }
  let(:service) do
    UpdateVenue.new(
      venue: venue,
      params: update_params,
      reminder_users: reminder_users
    )
  end
  let(:call_service) { service.call }
  let(:result) { call_service }

  context 'when updating name' do
    let(:new_name) { 'new name' }
    let(:update_params) do
      {
        name: new_name
      }
    end

    it 'should succeed' do
      call_service
      expect(result.success?).to eq(true)
    end

    it 'should update the name' do
      call_service
      venue.reload
      expect(venue.name).to eq(new_name)
    end

    context 'when finance reports exist' do
      let(:previous_week) do
        RotaWeek.new(today - 1.week)
      end
      let(:previous_week_finance_report) do
        FactoryGirl.create(
          :finance_report,
          staff_member: staff_member,
          venue: venue,
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
          venue: venue,
          week_start: previous_week2.start_date
        ).tap do |report|
          report.mark_ready!
        end
      end
      let(:current_week_finance_report) do
        FactoryGirl.create(
          :finance_report,
          staff_member: staff_member,
          venue: venue,
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
        it 'should mark all incomplete finance reports for update' do
          call_service
          existing_finance_reports.each(&:reload)

          expect(current_week_finance_report.done?).to eq(true)
          expect(previous_week_finance_report.requiring_update?).to eq(true)
          expect(previous_week2_finance_report.requiring_update?).to eq(true)
        end
      end
    end
  end
end
