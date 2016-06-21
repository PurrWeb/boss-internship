require 'rails_helper'

describe HoursAcceptancePeriod do
  describe 'validations' do
    let(:date) { Time.current.to_date }
    let(:start_of_day) { RotaShiftDate.new(date).start_time }
    let(:period) do
      HoursAcceptancePeriod.new(
        clock_in_day: clock_in_day,
        starts_at: starts_at,
        ends_at: ends_at,
        creator: user
      )
    end
    let(:starts_at) { start_of_day + 1.hour }
    let(:ends_at) { start_of_day + 2.hours }
    let(:user) { FactoryGirl.create(:user) }
    let(:staff_member) { FactoryGirl.create(:staff_member) }
    let(:venue) { FactoryGirl.create(:venue) }
    let(:clock_in_day) do
      ClockInDay.create!(
        creator: user,
        staff_member: staff_member,
        venue: venue,
        date: date
      )
    end

    specify do
      period.validate
      expect(period.errors.to_a).to eq([])
    end

    context 'times are in wrong order' do
      let(:starts_at) { start_of_day + 2.hours }
      let(:ends_at) { start_of_day + 1.hour }

      specify 'should raise error' do
        period.validate
        expect(period.errors[:base]).to include("starts_at must be after ends_at")
      end
    end

    context 'starts_at on wrong rota date' do
      let(:starts_at) { start_of_day - 2.hours }

      specify 'should raise error' do
        expect{
          period.validate
        }.to raise_error(
          RuntimeError,
          starts_at_early_error_message_for(
            time: period.starts_at,
            date: period.date
          )
        )
      end
    end

    context 'ends_at on wrong rota date' do
      let(:ends_at) { start_of_day - 2.hours }

      specify 'should raise error' do
        expect{
          period.validate
        }.to raise_error(
          RuntimeError,
          ends_at_early_error_message_for(
            time: period.ends_at,
            date: period.date
          )
        )
      end
    end

    context 'period overlaps existing period' do
      let(:existing_period_clock_in_day) { clock_in_day }
      let(:existing_period_starts_at) { starts_at }
      let(:existing_period_ends_at) { ends_at }
      let(:existing_period) do
        HoursAcceptancePeriod.create!(
          clock_in_day: existing_period_clock_in_day,
          starts_at: existing_period_starts_at,
          ends_at: existing_period_ends_at,
          creator: user
        )
      end

      before do
        existing_period
      end

      specify 'should raise overlap error' do
        period.validate
        expect(period.errors[:base]).to include("period overlaps existing period")
      end

      context 'existing period is for different venue' do
        let(:new_venue) { FactoryGirl.create(:venue) }
        let(:existing_period_clock_in_day) do
          ClockInDay.create!(
            venue: new_venue,
            staff_member: staff_member,
            date: date,
            creator: user
          )
        end

        specify 'should raise overlap error' do
          period.validate
          expect(period.errors[:base]).to include("period overlaps existing period")
        end
      end

      context 'existing period is for different staff_member' do
        let(:new_staff_member) { FactoryGirl.create(:staff_member) }
        let(:existing_period_clock_in_day) do
          ClockInDay.create!(
            venue: venue,
            staff_member: new_staff_member,
            date: date,
            creator: user
          )
        end
        specify 'should not raise overlap error' do
          period.validate
          expect(period.errors[:base]).to eq([])
        end
      end
    end

    context 'period overlaps itself' do
      before do
        period.save!
      end

      specify 'should not raise overlap error' do
        period.starts_at = period.starts_at - 10.minutes

        period.validate
        expect(period.errors[:base]).to eq([])
      end
    end

    def starts_at_early_error_message_for(time:,  date:)
      "starts_at time #{time} suppiled too early for #{date}"
    end

    def ends_at_early_error_message_for(time:,  date:)
      "ends_at time #{time} suppiled too early for #{date}"
    end
  end

  describe 'payable hours' do
    let(:date) { Time.current.to_date }
    let(:start_of_day) { RotaShiftDate.new(date).start_time }
    let(:period) do
      HoursAcceptancePeriod.create!(
        clock_in_day: clock_in_day,
        starts_at: starts_at,
        ends_at: ends_at,
        creator: user
      )
    end
    let(:starts_at) { start_of_day }
    let(:ends_at) { start_of_day + 2.hours + 30.minutes }
    let(:user) { FactoryGirl.create(:user) }
    let(:staff_member) { FactoryGirl.create(:staff_member) }
    let(:venue) { FactoryGirl.create(:venue) }
    let(:clock_in_day) do
      ClockInDay.create!(
        creator: user,
        staff_member: staff_member,
        venue: venue,
        date: date
      )
    end

    it 'should report legnth correctly' do
      expect(period.payable_hours).to eq(2.5)
    end

    context 'when breaks exist' do
      let(:break1) do
        HoursAcceptanceBreak.create!(
          hours_acceptance_period: period,
          starts_at: start_of_day + 2.hours,
          ends_at: start_of_day + 2.hours + 30.minutes
        )
      end
      let(:break2) do
        HoursAcceptanceBreak.create!(
          hours_acceptance_period: period,
          starts_at: start_of_day + 1.hours,
          ends_at: start_of_day + 2.hours
        )
      end

      before do
        break1
        break2
      end

      specify do
        expect(period.payable_hours).to eq(1)
      end
    end
  end
end