require 'rails_helper'

describe RotaShift do
  describe '#total_hours' do
    context 'no ends_at is supplied' do
      let(:shift) { RotaShift.new(starts_at: starts_at, ends_at: ends_at) }
      let(:starts_at) { Time.zone.now.beginning_of_day + 10.hours + 30.minutes }
      let(:ends_at) { nil }

      it 'should return nil' do
        expect(shift.total_hours).to eq(nil)
      end
    end

    context 'no ends_at is supplied' do
      let(:shift) { RotaShift.new(starts_at: starts_at, ends_at: ends_at) }
      let(:starts_at) { nil }
      let(:ends_at) { Time.zone.now.beginning_of_day + 10.hours + 30.minutes }

      it 'should return nil' do
        expect(shift.total_hours).to eq(nil)
      end
    end

    context 'valid start and end time supplied' do
      let(:shift) { RotaShift.new(starts_at: starts_at, ends_at: ends_at) }
      let(:starts_at) { Time.zone.now.beginning_of_day + 8.hours }
      let(:ends_at) { Time.zone.now.beginning_of_day + 10.hours + 30.minutes }

      it 'should return the hours' do
        expect(shift.total_hours).to eq(2.5)
      end
    end

    context 'valid end time supplied is before start time' do
      let(:shift) { RotaShift.new(starts_at: starts_at, ends_at: ends_at) }
      let(:starts_at) { Time.zone.now.beginning_of_day + 10.hours + 30.minutes }
      let(:ends_at) { Time.zone.now.beginning_of_day + 8.hours }

      it 'should return nil' do
        expect(shift.total_hours).to eq(nil)
      end
    end
  end
end
