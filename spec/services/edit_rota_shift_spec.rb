require 'rails_helper'

RSpec.describe do
  let(:week) { RotaWeek.new(RotaShiftDate.to_rota_date(Time.zone.now)) }
  let(:service) do
    EditRotaShift.new(
      rota_shift: rota_shift,
      rota_shift_params: rota_shift_params,
      frontend_updates: frontend_updates
    )
  end
  let(:frontend_updates) do
    double 'frontend updates'
  end
  let(:rota) do
    FactoryGirl.create(
      :rota,
      date: week.start_date
    )
  end
  let(:rota_shift) do
    FactoryGirl.create(
      :rota_shift,
      rota: rota,
      staff_member: staff_member,
      starts_at: RotaShiftDate.new(week.start_date).start_time,
      ends_at: RotaShiftDate.new(week.start_date).start_time + 3.hours
    )
  end
  let(:staff_member) { FactoryGirl.create(:staff_member) }

  before do
    allow(frontend_updates).to receive(:update_shift)
  end

  context 'before call' do
    specify 'staff member does not require notification' do
      expect(staff_member.requires_notification?).to eq(false)
    end
  end

  context 'supplying valid params' do
    let(:result) { service.call }
    let(:rota_shift_params) do
      {
        starts_at: RotaShiftDate.new(week.start_date).start_time + 2.hours,
        ends_at: RotaShiftDate.new(week.start_date).start_time + 4.hours
      }
    end

    specify 'should register shift update' do
      expect(frontend_updates).to receive(:update_shift).with(shift: rota_shift)
      service.call
    end

    specify 'staff member does not require notification' do
      service.call
      expect(staff_member.requires_notification?).to eq(false)
    end

    it 'should succeed' do
      expect(result).to be_success
    end
  end

  context 'supplying invalid params' do
    let(:result) { service.call }
    let(:rota_shift_params) do
      {
        starts_at: RotaShiftDate.new(week.start_date).start_time + 4.hours,
        ends_at: RotaShiftDate.new(week.start_date).start_time + 5.hours + 10.minutes
      }
    end

    it 'should not succeed' do
      expect(result).to_not be_success
    end

    it 'should set errors on ' do
      expect(result.rota_shift.errors.keys).to eq([:ends_at])
    end
  end

  context 'rota is published' do
    let(:result) { service.call }
    let(:rota) do
      FactoryGirl.create(
        :rota,
        :published,
        date: week.start_date
      )
    end
    let(:rota_shift_params) do
      {
        starts_at: RotaShiftDate.new(week.start_date).start_time + 2.hours,
        ends_at: RotaShiftDate.new(week.start_date).start_time + 4.hours
      }
    end

    it 'should succeed' do
      expect(result).to be_success
    end

    specify 'should register shift update' do
      expect(frontend_updates).to receive(:update_shift).with(shift: rota_shift)
      service.call
    end

    specify 'staff member is marked as requiring notification' do
      service.call
      expect(staff_member.requires_notification?).to eq(true)
    end
  end
end
