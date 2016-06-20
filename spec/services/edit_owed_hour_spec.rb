require 'rails_helper'

RSpec.describe 'EditOwedHour service'  do
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
      note: owed_hour.note
    }
  end

  let(:service) do
    EditOwedHour.new(
      requester: requester,
      owed_hour: owed_hour,
      params: owed_hour_params
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
        foo: 'asdsa'
      }
    end

    specify 'it throws an argument error' do
      expect{ service.call }.to raise_error(ArgumentError)
    end
  end

  context 'supplying too few owed_hour params' do
    let(:owed_hour_params) do
      {
        week_start_date: owed_hour.week_start_date,
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
        note: owed_hour.note
      }
    end
    let(:result) { service.call }

    before do
      result
    end

    it 'should be a success' do
      expect(result).to be_success
    end

    specify 'owed_hour is disabled' do
      expect(owed_hour.reload.disabled?).to eq(true)
    end

    specify 'disabled_by field is set' do
      expect(owed_hour.reload.disabled_by).to eq(requester)
    end

    specify 'staff member has a new active owed_hour' do
      expect(staff_member.reload.active_owed_hours.count).to eq(1)
    end

    describe 'new owed_hour' do
      let(:new_owed_hour) { staff_member.reload.active_owed_hours.first }

      it 'adssda' do
        expect(new_owed_hour).to be_present
      end

      it 'is parent of old owed_hour' do
        expect(owed_hour.reload.parent).to eq(new_owed_hour)
      end
    end
  end

  context 'params are invalid' do
    let(:owed_hour_params) do
      {
        week_start_date: nil,
        minutes: 30,
        note: owed_hour.note
      }
    end
    let(:result) { service.call }

    before do
      result
    end

    it 'should not be a success' do
      expect(result).to_not be_success
    end

    specify 'owed_hour remains enabled' do
      expect(owed_hour.reload.disabled?).to eq(false)
    end

    specify 'no new owed_hour should be created' do
      expect(staff_member.reload.active_owed_hours.count).to eq(1)
    end

    specify 'it should return the owed_hour' do
      expect(result.owed_hour).to eq(owed_hour)
    end

    specify 'it should return the error' do
      expect(result.owed_hour.errors.keys).to eq([:week_start_date])
    end
  end
end
