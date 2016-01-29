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
        let(:new_starts_at) { ends_at + 15.minutes }
        let(:new_ends_at) { ends_at + 45.minutes }
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
end
