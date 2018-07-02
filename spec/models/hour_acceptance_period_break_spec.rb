require 'rails_helper'

describe HoursAcceptanceBreak do
  describe 'validations' do
    let(:date) { Time.current.to_date }
    let(:start_of_day) { RotaShiftDate.new(date).start_time }
    let(:_break) do
      HoursAcceptanceBreak.new(
        hours_acceptance_period: hours_acceptance_period,
        starts_at: starts_at,
        ends_at: ends_at
      )
    end
    let(:start_of_period) { start_of_day + 1.hour }
    let(:end_of_period) { start_of_day + 7.hours }
    let(:starts_at) { start_of_period }
    let(:ends_at) { start_of_period + 2.hours }
    let(:user) { FactoryGirl.create(:user) }
    let(:staff_member) { FactoryGirl.create(:staff_member) }
    let(:venue) { FactoryGirl.create(:venue) }
    let(:hours_acceptance_period) do
      HoursAcceptancePeriod.create!(
        clock_in_day: clock_in_day,
        starts_at: start_of_period,
        ends_at: end_of_period,
        creator: user
      )
    end
    let(:clock_in_day) do
      ClockInDay.create!(
        creator: user,
        staff_member: staff_member,
        venue: venue,
        date: date
      )
    end

    specify do
      _break.validate
      expect(_break.errors.to_a).to eq([])
    end

    context 'hours outside left boundary of parent period' do
      let(:starts_at) { start_of_period - 1.hour }

      specify 'should raise error' do
        _break.validate
        expect(_break.errors[:starts_at]).to eq([BreakWithinParentTimeframeValidator::OUTSIDE_OF_PERIOD_VALIDATION_MESSAGE])
      end
    end

    context 'hours outside right boundary of parent period' do
      let(:ends_at) { end_of_period + 1.hour }

      specify 'should raise error' do
        _break.validate
        expect(_break.errors[:ends_at]).to eq([BreakWithinParentTimeframeValidator::OUTSIDE_OF_PERIOD_VALIDATION_MESSAGE])
      end
    end

    context 'times are in wrong order' do
      let(:starts_at) { start_of_period + 2.hours }
      let(:ends_at) { start_of_period + 1.hour }

      specify 'should raise error' do
        _break.validate
        expect(_break.errors[:starts_at]).to eq(["can't be after or equal end time"])
        expect(_break.errors[:ends_at]).to eq(["can't be before or equal start time"])
      end
    end

    context 'starts_at on wrong rota date' do
      let(:starts_at) { start_of_day - 2.hours }

      specify 'should raise error' do
        expect{
          _break.validate
        }.to raise_error(
          RuntimeError,
          starts_at_early_error_message_for(
            time: _break.starts_at,
            date: clock_in_day.date
          )
        )
      end
    end

    context 'ends_at on wrong rota date' do
      let(:ends_at) { start_of_day - 2.hours }

      specify 'should raise error' do
        expect{
          _break.validate
        }.to raise_error(
          RuntimeError,
          ends_at_early_error_message_for(
            time: _break.ends_at,
            date: clock_in_day.date
          )
        )
      end
    end

    context 'break overlaps existing break' do
      let(:existing_break_hours_acceptance_period) { hours_acceptance_period }
      let(:existing_break_starts_at) { starts_at }
      let(:existing_break_ends_at) { ends_at }
      let(:existing_break) do
        HoursAcceptanceBreak.create!(
          hours_acceptance_period: existing_break_hours_acceptance_period,
          starts_at: existing_break_starts_at,
          ends_at: existing_break_ends_at
        )
      end

      before do
        existing_break
      end

      specify 'should raise overlap error' do
        _break.validate
        expect(_break.errors[:base]).to include("break overlaps existing break")
      end

      context 'existing break is for different period' do
        let(:start_of_existing_period) { end_of_period }
        let(:end_of_existing_period) { end_of_period + 6.hours }
        let(:existing_break_starts_at) { start_of_existing_period }
        let(:existing_break_ends_at) { start_of_existing_period + 2.hours }
        let(:existing_break_hours_acceptance_period) do
          HoursAcceptancePeriod.create!(
            clock_in_day: clock_in_day,
            starts_at: start_of_existing_period,
            ends_at: end_of_existing_period,
            creator: user
          )
        end

        specify 'should not raise overlap error' do
          _break.validate
          expect(_break.errors[:base]).to eq([])
        end
      end
    end

    context '_break overlaps itself' do
      before do
        _break.save!
      end

      specify 'should not raise overlap error' do
        _break.starts_at = _break.starts_at - 10.minutes

        _break.validate
        expect(_break.errors[:base]).to eq([])
      end
    end

    def starts_at_early_error_message_for(time:,  date:)
      "starts_at time #{time} suppiled too early for #{date}"
    end

    def ends_at_early_error_message_for(time:,  date:)
      "ends_at time #{time} suppiled too early for #{date}"
    end
  end
end
