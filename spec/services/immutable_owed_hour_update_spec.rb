require 'rails_helper'

RSpec.describe 'ImmutableOwedHourUpdate service'  do
  let(:requester) { FactoryGirl.create(:user) }
  let(:week_start_date) { Time.zone.now.beginning_of_week.to_date }
  let(:minutes) { 50 }
  let(:owed_hour) do
    FactoryGirl.create(
      :owed_hour,
      week_start_date: week_start_date,
      minutes: minutes
    )
  end
  let(:staff_member) { owed_hour.staff_member }
  let(:owed_hour_params) do
    {
      week_start_date: owed_hour.week_start_date,
      minutes: owed_hour.minutes,
      note: owed_hour.note,
      staff_member: owed_hour.staff_member
    }
  end
  let(:new_owed_hour) { OwedHour.new(owed_hour_params) }
  let(:service) do
    ImmutableOwedHourUpdate.new(
      requester: requester,
      old_owed_hour: owed_hour,
      new_owed_hour: new_owed_hour
    )
  end

  context 'before call' do
    specify 'owed_hour should be enabled' do
      expect(owed_hour.disabled?).to eq(false)
    end

    specify 'owed_hour should be staff members only owed_hour' do
      expect(staff_member.active_owed_hours).to eq([owed_hour])
    end
  end

  context 'supplying unknown owed_hour param' do
    let(:owed_hour_params) do
      {
        week_start_date: owed_hour.week_start_date,
        foo: 'asdsa',
        staff_member: owed_hour.staff_member
      }
    end

    specify 'it throws an argument error' do
      expect{ service.call }.to raise_error(ActiveRecord::UnknownAttributeError)
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
    let(:owed_hour_params) do
      {
        week_start_date: owed_hour.week_start_date,
        minutes: 10,
        note: owed_hour.note,
        staff_member: owed_hour.staff_member
      }
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
        service.call
        expect(new_owed_hour).to be_persisted
      end

      it 'is parent of old owed_hour' do
        service.call
        expect(owed_hour.reload.parent).to eq(new_owed_hour)
      end
    end
  end

  context 'params are invalid' do
    let(:owed_hour_params) do
      {
        week_start_date: nil,
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