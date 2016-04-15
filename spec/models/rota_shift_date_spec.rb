require 'rails_helper'

describe 'Rota shift date' do
  describe 'self#to_rota_date' do
    let(:call) { RotaShiftDate.to_rota_date(time) }
    let(:calendar_date) { time.to_date }

    context 'time is before 8am' do
      let(:time) { Time.zone.now.beginning_of_day + 4.hours }

      specify 'result is day before calendar date' do
        expect(call).to eq(calendar_date - 1.day)
      end
    end

    context 'time is after 8am' do
      let(:time) { Time.zone.now.beginning_of_day + 12.hours }

      specify 'result is calendar date' do
        expect(call).to eq(calendar_date)
      end
    end
  end

  describe 'start_time' do
    let(:date) { RotaShiftDate.new(time) }
    let(:calendar_date) { time.to_date }

    context 'time is before 8am' do
      let(:time) { Time.zone.now.beginning_of_day + 4.hours }
      let(:expected_start_time) do
        (calendar_date - 1.day).beginning_of_day + 8.hours
      end

      specify 'starts_at is at 8am the previous calendar day' do
        expect(date.start_time).to eq(expected_start_time)
      end
    end

    context 'time is after 8am' do
      let(:time) { Time.zone.now.beginning_of_day + 12.hours }
      let(:expected_start_time) do
        calendar_date.beginning_of_day + 8.hours
      end

      specify 'result is at 8am the current calendar day' do
        expect(date.start_time).to eq(expected_start_time)
      end
    end
  end

  describe 'end_time' do
    let(:date) { RotaShiftDate.new(time) }
    let(:calendar_date) { time.to_date }

    context 'time is before 8am' do
      let(:time) { Time.zone.now.beginning_of_day + 4.hours }
      let(:expected_end_time) do
        calendar_date.beginning_of_day + 8.hours
      end

      specify 'ends is at 8am on the calendar day' do
        expect(date.end_time).to eq(expected_end_time)
      end
    end

    context 'time is after 8am' do
      let(:time) { Time.zone.now.beginning_of_day + 12.hours }
      let(:expected_end_time) do
        (calendar_date + 1.day).beginning_of_day + 8.hours
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
