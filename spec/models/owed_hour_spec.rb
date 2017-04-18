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

    specify do
      expect(owed_hour).to be_valid
    end
  end
end
