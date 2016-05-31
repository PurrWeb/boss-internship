require 'rails_helper'

describe ClockInDaysPendingConfirmationQuery do
  let(:date) { Time.current.to_date }
  let(:user) { FactoryGirl.create(:user) }
  let(:venue) { FactoryGirl.create(:venue) }
  let(:staff_member) { FactoryGirl.create(:staff_member) }
  let(:query) { ClockInDaysPendingConfirmationQuery.new(venue: venue) }
  let(:hours_acceptance_reason) do
    HoursAcceptanceReason.create!(
      text: 'nothing',
      rank: 0,
      enabled: true
    )
  end
  let(:clock_in_day) do
    ClockInDay.create!(
      staff_member: staff_member,
      venue: venue,
      date: date,
      creator: user
    )
  end
  let(:start_of_day) { RotaShiftDate.new(date).start_time }

  before do
    clock_in_day
  end

  context 'clock in day has accepted hours acceptance' do
    before do
      HoursAcceptancePeriod.create!(
        clock_in_day: clock_in_day,
        hours_acceptance_reason: hours_acceptance_reason,
        starts_at: start_of_day,
        ends_at: start_of_day + 1.hour,
        status: 'accepted',
        creator: user
      )
    end

    it 'should not be returned' do
      expect(query.all).to eq([])
    end

    context 'clock in day has pending hours acceptance' do
      before do
        HoursAcceptancePeriod.create!(
          clock_in_day: clock_in_day,
          hours_acceptance_reason: hours_acceptance_reason,
          starts_at: start_of_day + 1.hour,
          ends_at: start_of_day + 2.hour,
          status: 'pending',
          creator: user
        )
      end

      it 'is returned' do
        expect(query.all).to eq([clock_in_day])
      end
    end
  end

  context 'clock in day has compete clock in period' do
    before do
      ClockInPeriod.create!(
        clock_in_day: clock_in_day,
        starts_at: start_of_day,
        ends_at: start_of_day + 1.hour,
        creator: user
      )
    end

    it 'should not be returned' do
      expect(query.all).to eq([])
    end

    context 'clock in day has incomplete clock in period' do
      before do
        ClockInPeriod.create!(
          clock_in_day: clock_in_day,
          starts_at: start_of_day + 1.hour,
          ends_at: nil,
          creator: user
        )
      end

      it 'is returned' do
        expect(query.all).to eq([clock_in_day])
      end
    end
  end
end
