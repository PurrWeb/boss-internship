require 'rails_helper'

describe ClockInPeriod do
  describe 'validations' do
    let(:date) { Time.current.to_date }
    let(:start_of_day) { RotaShiftDate.new(date).start_time }
    let(:period) do
      ClockInPeriod.new(
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
        expect(period.errors[:starts_at]).to include(" must be before end time")
        expect(period.errors[:ends_at]).to include(" must be after start time")
      end
    end

    context 'starts_at on wrong rota date' do
      let(:starts_at) { start_of_day - 2.hours }

      specify 'should raise error' do
        period.validate
        expect(period.errors[:starts_at]).to eq([
          starts_at_early_error_message_for(
            time: period.starts_at,
            date: period.date
          )
        ])
      end
    end

    context 'ends_at on wrong rota date' do
      let(:ends_at) { start_of_day - 2.hours }

      specify 'should raise error' do
        period.validate
        expect(period.errors[:ends_at]).to eq([
          " must be after start time",
          ends_at_early_error_message_for(
            time: period.ends_at,
            date: period.date
          )
        ])
      end
    end

    context 'period overlaps existing period' do
      let(:existing_period_clock_in_day) { clock_in_day }
      let(:existing_period_starts_at) { starts_at }
      let(:existing_period_ends_at) { ends_at }
      let(:existing_period) do
        ClockInPeriod.create!(
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
      "time #{time} suppiled too early for #{date}"
    end

    def ends_at_early_error_message_for(time:,  date:)
      "time #{time} suppiled too early for #{date}"
    end
  end
end
