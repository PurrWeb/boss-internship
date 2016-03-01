require 'rails_helper'

describe RotaShift do
  describe 'validations' do
    describe 'shift_does_not_overlap_existing_shift' do
      let(:user) { FactoryGirl.create(:user) }
      let(:rota) { FactoryGirl.create(:rota, creator: user) }
      let(:rota_date) { rota.date }
      let(:starts_at) { rota_date.beginning_of_day + 9.hours }
      let(:ends_at) { rota_date.beginning_of_day + 9.hours + 30.minutes }
      let!(:shift) do
        FactoryGirl.create(
          :rota_shift,
          rota: rota,
          starts_at: starts_at,
          ends_at: ends_at,
          creator: user
        )
      end

      context 'when new shift does not overlap' do
        let(:new_starts_at) { ends_at + 30.minutes }
        let(:new_ends_at) { ends_at + 1.hour }
        let(:new_shift) do
          RotaShift.new(
            rota: rota,
            staff_member: shift.staff_member,
            starts_at: new_starts_at,
            ends_at: new_ends_at,
            creator: user
          ).tap(&:valid?)
        end

        it 'should be valid' do
          expect(new_shift).to be_valid
        end

        it 'should not produce a validation error' do
          expect(new_shift.errors[:base]).to_not include('shift overlaps existing shift')
        end
      end

      context 'when new shift overlaps' do
        let(:overlapping_starts_at) { starts_at + 15.minutes }
        let(:overlapping_ends_at) { ends_at + 15.minutes }
        let(:new_shift) do
          RotaShift.new(
            rota: rota,
            staff_member: shift.staff_member,
            starts_at: overlapping_starts_at,
            ends_at: overlapping_ends_at
          ).tap(&:valid?)
        end

        it 'should not be valid' do
          expect(new_shift).to_not be_valid
        end

        it 'should not produce a validation error' do
          expect(new_shift.errors[:base]).to include('shift overlaps existing shift')
        end
      end
    end
  end

  describe '#total_hours' do
    context 'no ends_at is supplied' do
      let(:shift) { RotaShift.new(starts_at: starts_at, ends_at: ends_at) }
      let(:starts_at) { Time.now.beginning_of_day + 10.hours + 30.minutes }
      let(:ends_at) { nil }

      it 'should return nil' do
        expect(shift.total_hours).to eq(nil)
      end
    end

    context 'no ends_at is supplied' do
      let(:shift) { RotaShift.new(starts_at: starts_at, ends_at: ends_at) }
      let(:starts_at) { nil }
      let(:ends_at) { Time.now.beginning_of_day + 10.hours + 30.minutes }

      it 'should return nil' do
        expect(shift.total_hours).to eq(nil)
      end
    end

    context 'valid start and end time supplied' do
      let(:shift) { RotaShift.new(starts_at: starts_at, ends_at: ends_at) }
      let(:starts_at) { Time.now.beginning_of_day + 8.hours }
      let(:ends_at) { Time.now.beginning_of_day + 10.hours + 30.minutes }

      it 'should return the hours' do
        expect(shift.total_hours).to eq(2.5)
      end
    end

    context 'valid end time supplied is before start time' do
      let(:shift) { RotaShift.new(starts_at: starts_at, ends_at: ends_at) }
      let(:starts_at) { Time.now.beginning_of_day + 10.hours + 30.minutes }
      let(:ends_at) { Time.now.beginning_of_day + 8.hours }

      it 'should return nil' do
        expect(shift.total_hours).to eq(nil)
      end
    end
  end
end
