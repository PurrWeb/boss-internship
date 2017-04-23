require 'rails_helper'

describe OwedHour do
  describe 'validation' do
    let(:now) { Time.current }
    let(:staff_member) { FactoryGirl.create(:staff_member) }
    let(:user) { FactoryGirl.create(:user) }
    let(:date) { RotaShiftDate.to_rota_date(now - 1.week) }
    let(:note) { 'Test note' }
    let(:starts_at) { RotaShiftDate.new(date).start_time }
    let(:ends_at) { starts_at + 2.hours }
    let(:minutes) { (ends_at - starts_at) / 60 }
    let(:owed_hour) do
      OwedHour.new(
        staff_member: staff_member,
        date: date,
        starts_at: starts_at,
        ends_at: ends_at,
        minutes: minutes,
        creator: user,
        note: note
      )
    end

    specify 'owed_hour should be valid' do
      expect(owed_hour).to be_valid
    end

    context 'owed_hour aready exists at conflicting time' do
      before do
        OwedHour.create!(
          staff_member: staff_member,
          date: date,
          starts_at: starts_at,
          ends_at: ends_at,
          minutes: minutes,
          creator: user,
          note: note
        )
      end

      specify 'owed hour should not be valid' do
        expect(owed_hour).to_not be_valid
      end

      specify 'error should appear on base' do
        owed_hour.valid?
        expect(owed_hour.errors[:base]).to eq(['conflicting owed hour exists'])
      end
    end

    context 'HoursAcceptancePeriod aready exists at conflicting time' do
      before do
        clock_in_day = ClockInDay.create!(
          staff_member: staff_member,
          date: date,
          creator: user,
          venue: staff_member.master_venue
        )

        HoursAcceptancePeriod.create!(
          clock_in_day: clock_in_day,
          starts_at: starts_at,
          ends_at: ends_at,
          creator: user
        )
      end

      specify 'owed hour should not be valid' do
        expect(owed_hour).to_not be_valid
      end

      specify 'error should appear on base' do
        owed_hour.valid?
        expect(owed_hour.errors[:base]).to eq(['conflicting hour acceptance exists'])
      end
    end
  end
end
