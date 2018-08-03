require 'rails_helper'

RSpec.describe 'DeleteOwedHour service'  do
  let(:now) { Time.current }
  let(:today) { RotaShiftDate.to_rota_date(now) }
  let(:current_week) { RotaWeek.new(today) }
  let(:requester) { FactoryGirl.create(:user) }
  let(:date) { current_week.start_date  }
  let(:start_of_owed_hour_day) { RotaShiftDate.new(date).start_time }
  let(:duration_minutes) { 50 }
  let(:payslip_date) { current_week.start_date }
  let(:requester) { FactoryGirl.create(:user) }
  let(:owed_hour) do
    FactoryGirl.create(
      :owed_hour,
      staff_member: staff_member,
      date: date,
      payslip_date: payslip_date,
      minutes: duration_minutes,
      starts_at: start_of_owed_hour_day,
      ends_at: start_of_owed_hour_day + duration_minutes.minutes,
      finance_report: existing_finance_report
    )
  end
  let(:staff_member) { FactoryGirl.create(:staff_member, master_venue: venue) }
  let(:venue) { FactoryGirl.create(:venue) }
  let(:existing_finance_report) do
    FactoryGirl.create(
      :finance_report,
      staff_member: staff_member,
      venue: venue,
      week_start: current_week.start_date
    ).tap do |report|
      report.mark_ready!
    end
  end

  let(:service) do
    DeleteOwedHour.new(
      requester: requester,
      owed_hour: owed_hour
    )
  end

  context 'before call' do
    specify 'owed_hour should be enabled' do
      expect(owed_hour.disabled?).to eq(false)
    end

    specify 'finance report should be ready' do
    end
  end

  context 'after call' do
    before do
      service.call
    end

    specify 'owed_hour is disabled' do
      expect(owed_hour.disabled?).to eq(true)
    end

    specify 'owed_hour disabled_by is requester' do
      expect(owed_hour.disabled_by).to eq(requester)
    end

    specify 'finance report should be marked as update' do
      finance_report = existing_finance_report.reload
      expect(finance_report.requiring_update?).to eq(true)
    end
  end

  context 'owed_hour is frozen' do
    let(:finance_report) do
      FactoryGirl.create(:finance_report).tap do |finance_report|
        finance_report.mark_ready!
        finance_report.allow_mark_completed = true
        finance_report.mark_completed!
      end
    end
    let(:owed_hour) do
      FactoryGirl.create(
        :owed_hour,
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
      expect(result.owed_hour.errors[:base]).to eq(["can't delete owed hour that has been frozen"])
    end
  end
end
