require 'rails_helper'

RSpec.describe 'EditOldHour service'  do
  let(:requester) { FactoryGirl.create(:user) }
  let(:week_start_date) { Time.zone.now.beginning_of_week.to_date }
  let(:minutes) { 50 }
  let(:old_hour) do
    FactoryGirl.create(
      :old_hour,
      week_start_date: week_start_date,
      minutes: minutes
    )
  end
  let(:staff_member) { old_hour.staff_member }
  let(:old_hour_params) do
    {
      week_start_date: old_hour.week_start_date,
      minutes: old_hour.minutes,
      note: old_hour.note
    }
  end

  let(:service) do
    EditOldHour.new(
      requester: requester,
      old_hour: old_hour,
      params: old_hour_params
    )
  end

  context 'before call' do
    specify 'old_hour should be enabled' do
      expect(old_hour.disabled?).to eq(false)
    end

    specify 'old_hour should be staff members only old_hour' do
      expect(staff_member.active_old_hours).to eq([old_hour])
    end
  end

  context 'supplying unknown old_hour param' do
    let(:old_hour_params) do
      {
        week_start_date: old_hour.week_start_date,
        foo: 'asdsa'
      }
    end

    specify 'it throws an argument error' do
      expect{ service.call }.to raise_error(ArgumentError)
    end
  end

  context 'supplying too few old_hour params' do
    let(:old_hour_params) do
      {
        week_start_date: old_hour.week_start_date,
      }
    end

    specify 'it throws an argument error' do
      expect{ service.call }.to raise_error(ArgumentError)
    end
  end

  context 'attributes have not changed' do
    let(:result) { service.call }
    before do
      result
    end

    describe 'result' do
      it 'should be' do
        expect(result).to be_success
      end
    end

    specify 'old_hour remains enabled' do
      expect(old_hour.reload.disabled?).to eq(false)
    end

    specify 'no new old_hour should be created' do
      expect(staff_member.reload.active_old_hours.count).to eq(1)
    end
  end

  context 'old_hour params have changed' do
    let(:old_hour_params) do
      {
        week_start_date: old_hour.week_start_date,
        minutes: 10,
        note: old_hour.note
      }
    end
    let(:result) { service.call }

    before do
      result
    end

    it 'should be a success' do
      expect(result).to be_success
    end

    specify 'old_hour is disabled' do
      expect(old_hour.reload.disabled?).to eq(true)
    end

    specify 'disabled_by field is set' do
      expect(old_hour.reload.disabled_by).to eq(requester)
    end

    specify 'staff member has a new active old_hour' do
      expect(staff_member.reload.active_old_hours.count).to eq(1)
    end

    describe 'new old_hour' do
      let(:new_old_hour) { staff_member.reload.active_old_hours.first }

      it 'adssda' do
        expect(new_old_hour).to be_present
      end

      it 'is parent of old old_hour' do
        expect(old_hour.reload.parent).to eq(new_old_hour)
      end
    end
  end

  context 'params are invalid' do
    let(:old_hour_params) do
      {
        week_start_date: nil,
        minutes: 30,
        note: old_hour.note
      }
    end
    let(:result) { service.call }

    before do
      result
    end

    it 'should not be a success' do
      expect(result).to_not be_success
    end

    specify 'old_hour remains enabled' do
      expect(old_hour.reload.disabled?).to eq(false)
    end

    specify 'no new old_hour should be created' do
      expect(staff_member.reload.active_old_hours.count).to eq(1)
    end

    specify 'it should return the old_hour' do
      expect(result.old_hour).to eq(old_hour)
    end

    specify 'it should return the error' do
      expect(result.old_hour.errors.keys).to eq([:week_start_date])
    end
  end
end
