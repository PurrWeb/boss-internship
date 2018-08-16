require 'rails_helper'

RSpec.describe 'ImmutableOwedHourUpdate service'  do
  let(:now) { Time.current }
  let(:today) { RotaShiftDate.to_rota_date(now) }
  let(:current_week) { RotaWeek.new(today) }
  let(:requester) { FactoryGirl.create(:user) }
  let(:date) { current_week.start_date  }
  let(:payslip_date) { current_week.start_date }
  let(:rota_shift_date) { RotaShiftDate.new(date) }
  let(:minutes) { 50 }
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
  let(:owed_hour) do
    FactoryGirl.create(
      :owed_hour,
      staff_member: staff_member,
      date: date,
      payslip_date: payslip_date,
      minutes: minutes,
      starts_at: rota_shift_date.start_time,
      ends_at: rota_shift_date.start_time + minutes.minutes,
      finance_report: existing_finance_report
    )
  end
  let(:owed_hour_params) do
    {
      date: date,
      payslip_date: payslip_date,
      minutes: owed_hour.minutes,
      note: owed_hour.note,
      staff_member: staff_member
    }
  end
  let(:new_owed_hour) { OwedHour.new(owed_hour_params) }
  let(:service) do
    ImmutableOwedHourUpdate.new(
      requester: requester,
      owed_hour: owed_hour,
      params: owed_hour_params
    )
  end

  before do
    owed_hour
  end

  context 'before call' do
    specify 'owed_hour should be enabled' do
      expect(owed_hour.disabled?).to eq(false)
    end

    specify 'owed_hour should be staff members only owed_hour' do
      expect(staff_member.active_owed_hours).to eq([owed_hour])
    end

    specify 'existing_finance_report should be setup' do
      expect(FinanceReport.all.count).to eq(1)
      finance_report = FinanceReport.first
      expect(finance_report.ready?).to eq(true)
    end
  end

  context 'supplying unknown owed_hour param' do
    let(:owed_hour_params) do
      {
        date: owed_hour.date,
        foo: 'asdsa',
        staff_member: owed_hour.staff_member
      }
    end

    specify 'it throws an argument error' do
      expect{ service.call }.to raise_error(ArgumentError)
    end
  end

  context 'attributes have not changed' do
    specify 'owed_hour remains enabled' do
      expect(owed_hour.reload.disabled?).to eq(false)
    end

    specify 'no new owed_hour should be created' do
      expect(staff_member.reload.active_owed_hours.count).to eq(1)
    end
  end

  context 'owed_hour params have changed' do
    let(:new_minutes) { 10 }
    let(:next_week) { RotaWeek.new(today + 1.week )}
    let(:new_owed_hour_duration_minutes) { 1260 }
    let(:new_owed_hour_date) { today - 2.weeks }
    let(:new_start_of_owed_hour_day) { RotaShiftDate.new(new_owed_hour_date).start_time }
    let(:new_owed_hour_starts_at) { new_start_of_owed_hour_day }
    let(:new_owed_hour_ends_at) { new_start_of_owed_hour_day + new_owed_hour_duration_minutes.minutes }
    let(:new_owed_hour_note) { 'New note' }
    let(:new_payslip_date) { payslip_date }
    let(:owed_hour_params) do
      {
        date: new_owed_hour_date,
        payslip_date: new_payslip_date,
        minutes: new_owed_hour_duration_minutes,
        note: new_owed_hour_note,
        starts_at: new_owed_hour_starts_at,
        ends_at: new_owed_hour_ends_at
      }
    end

    specify 'call to succeed' do
      result = service.call
      expect(result.success?).to eq(true)
    end

    specify 'owed_hour is disabled' do
      service.call
      expect(owed_hour.reload.disabled?).to eq(true)
    end

    specify 'disabled_by field is set' do
      service.call
      expect(owed_hour.reload.disabled_by).to eq(requester)
    end

    specify 'staff member has a new active owed_hour' do
      service.call
      expect(staff_member.reload.active_owed_hours.count).to eq(1)
    end

    describe 'new owed_hour' do
      it 'should persist new hour' do
        result = service.call
        expect(result.owed_hour).to be_persisted
      end

      it 'is parent of old owed_hour' do
        result = service.call
        expect(owed_hour.reload.parent.id).to eq(result.owed_hour.id)
      end

      it 'should have the new values' do
        result = service.call
        new_owed_hour = result.owed_hour

        expect(new_owed_hour.date).to eq(new_owed_hour_date)
        expect(new_owed_hour.payslip_date).to eq(new_payslip_date)
        expect(new_owed_hour.minutes).to eq(new_owed_hour_duration_minutes)
        expect(new_owed_hour.note).to eq(new_owed_hour_note)
        expect(new_owed_hour.starts_at).to eq(new_owed_hour_starts_at)
        expect(new_owed_hour.ends_at).to eq(new_owed_hour_ends_at)
      end

      it 'should be linked to existing finance report' do
        result = service.call
        new_owed_hour = result.owed_hour

        expect(new_owed_hour.finance_report).to eq(existing_finance_report)
      end
    end

    describe 'finance report' do
      it 'should be only report' do
        service.call
        expect(FinanceReport.all.count).to eq(1)
      end

      it 'should be marked for update' do
        service.call
        expect(existing_finance_report.reload.requiring_update?).to eq(true)
      end
    end

    context 'payslip date has moved to new week' do
      let(:new_payslip_date) { next_week.start_date }

      specify 'call to succeed' do
        result = service.call
        expect(result.success?).to eq(true)
      end

      specify 'new finance report is created' do
        service.call
        expect(FinanceReport.all.count).to eq(2)
      end

      specify 'new owed hour is assocciated with new finance report' do
        result = service.call
        new_owed_hour = result.owed_hour
        new_finance_report = FinanceReport.last

        expect(new_owed_hour.finance_report).to eq(new_finance_report)
      end

      describe 'old finance report' do
        it 'is marked as requiring update' do
          service.call
          existing_finance_report.reload
          expect(existing_finance_report.requiring_update?).to eq(true)
        end
      end

      describe 'new finance report' do
        it 'it matches new payslip date' do
          service.call
          new_finance_report = FinanceReport.last
          expect(new_finance_report.week_start).to eq(new_payslip_date)
        end

        it 'is marked as requiring update' do
          service.call
          new_finance_report = FinanceReport.last
          expect(new_finance_report.requiring_update?).to eq(true)
        end
      end
    end
  end

  context 'params are invalid' do
    let(:owed_hour_params) do
      {
        date: nil,
        minutes: 30,
        note: owed_hour.note,
        staff_member: owed_hour.staff_member
      }
    end

    specify 'owed_hour remains enabled' do
      expect{ result.call }.to raise_error
    end
  end
end
