require 'rails_helper'

describe 'Rota shift date' do
  let(:calendar_date) { Time.current.to_date }
  let(:eight_am) do
    Time.zone.local(
      calendar_date.year,
      calendar_date.month,
      calendar_date.day,
      8,
      0
    )
  end

  describe 'self#to_rota_date' do
    let(:call) { RotaShiftDate.to_rota_date(time) }

    context 'time is before 8am' do
      let(:time) { eight_am - 1.hour }

      specify 'result is day before calendar date' do
        expect(call).to eq(calendar_date - 1.day)
      end
    end

    context 'time is after 8am' do
      let(:time) { eight_am + 1.hour }

      specify 'result is calendar date' do
        expect(call).to eq(calendar_date)
      end
    end
  end

  describe 'start_time' do
    let(:date) { RotaShiftDate.new(time) }

    context 'time is before 8am' do
      let(:time) { eight_am - 1.hour }
      let(:previous_day) { calendar_date - 1.day }
      let(:expected_start_time) do
        Time.zone.local(
          previous_day.year,
          previous_day.month,
          previous_day.day,
          8,
          0
        )
      end

      specify 'starts_at is at 8am the previous calendar day' do
        expect(date.start_time).to eq(expected_start_time)
      end
    end

    context 'time is after 8am' do
      let(:time) { eight_am + 1.hour }
      let(:expected_start_time) do
        eight_am
      end

      specify 'result is at 8am the current calendar day' do
        expect(date.start_time).to eq(expected_start_time)
      end
    end
  end

  describe 'end_time' do
    let(:date) { RotaShiftDate.new(time) }

    context 'time is before 8am' do
      let(:time) { eight_am - 1.hour }
      let(:expected_end_time) do
        eight_am
      end

      specify 'ends is at 8am on the calendar day' do
        expect(date.end_time).to eq(expected_end_time)
      end
    end

    context 'time is after 8am' do
      let(:time) { eight_am + 1.hour }
      let(:next_day) { calendar_date + 1.day }
      let(:expected_end_time) do
        Time.zone.local(
          next_day.year,
          next_day.month,
          next_day.day,
          8,
          0
        )
      end

      specify 'result is at 8am the next calendar day' do
        expect(date.end_time).to eq(expected_end_time)
      end
    end
  end

  describe '#contains_time?' do
    let(:now) { Time.zone.now }
    let(:date) { RotaShiftDate.new(now) }

    specify do
      expect(date.contains_time?(date.start_time)).to eq(true)
      expect(date.contains_time?(date.start_time - 1.second)).to eq(false)
      expect(date.contains_time?(date.end_time)).to eq(true)
      expect(date.contains_time?(date.end_time + 1.second)).to eq(false)
    end
  end
end
