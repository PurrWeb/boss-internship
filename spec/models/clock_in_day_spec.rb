require 'rails_helper'

describe ClockInDay do
  describe '#current_clock_in_state' do
   let(:creator) { FactoryGirl.create(:user) }
   let(:date) { Time.current.to_date }
   let(:venue) { FactoryGirl.create(:venue) }
   let(:staff_member) { FactoryGirl.create(:staff_member) }

    let(:clock_in_day) do
      ClockInDay.create!(
        venue: venue,
        date: date,
        staff_member: staff_member,
        creator: creator
      )
    end

    context 'when no clock in periods exist' do
      specify 'it should be clocked out' do
        expect(clock_in_day.current_clock_in_state).to eq(:clocked_out)
      end
    end

    context 'when a previous clock in period exists' do
      let(:start_time) do
        RotaShiftDate.new(date).start_time
      end
      let(:clock_in_period) do
        ClockInPeriod.create!(
          clock_in_day: clock_in_day,
          creator: creator,
          starts_at: start_time
        )
      end
      let(:clock_in_event) do
        ClockInEvent.create!(
          event_type: 'clock_in',
          clock_in_period: clock_in_period,
          creator: creator,
          at: start_time
        )
      end

      before do
        clock_in_event
      end

      specify 'it should be clocked in' do
        expect(clock_in_day.current_clock_in_state).to eq(:clocked_in)
      end

      context 'do last event is a clock out' do
        let(:clock_out_event) do
          ClockInEvent.create!(
            event_type: 'clock_out',
            clock_in_period: clock_in_period,
            creator: creator,
            at: start_time + 1.hour
          )
        end

        before do
          clock_out_event
        end

        specify 'it should be clocked out' do
          expect(clock_in_day.current_clock_in_state).to eq(:clocked_out)
        end
      end

      context 'break in progress' do
        let(:break_start_event) do
          ClockInEvent.create!(
            event_type: 'start_break',
            clock_in_period: clock_in_period,
            creator: creator,
            at: start_time + 1.hour
          )
        end
        let(:break_end_event) do
          ClockInEvent.create!(
            event_type: 'end_break',
            clock_in_period: clock_in_period,
            creator: creator,
            at: start_time + 2.hour
          )
        end

        context 'last event is a break start' do
          before do
            break_start_event
          end

          specify 'it should be clocked out' do
            expect(clock_in_day.current_clock_in_state).to eq(:on_break)
          end
        end

        context 'last event is a break start' do
          before do
            break_start_event
            break_end_event
          end

          specify 'it should be clocked in' do
            expect(clock_in_day.current_clock_in_state).to eq(:clocked_in)
          end
        end
      end
    end
  end
end
