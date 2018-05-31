require 'rails_helper'

describe ShiftTimeOverlapValidator do
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
  let(:validator) { ShiftTimeOverlapValidator.new(new_shift) }

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
      )
    end

    before do
      validator.validate
    end

    it 'should not produce a validation error' do
      expect(new_shift.errors[:base]).to_not include("Shift overlaps existing (1) shifts: #{starts_at.strftime("%H:%M")}-#{ends_at.strftime("%H:%M")}")
    end
  end

  context 'when new shift overlaps' do
    let(:new_starts_at) { starts_at + 15.minutes }
    let(:new_ends_at) { ends_at + 15.minutes }
    let(:new_shift) do
      RotaShift.new(
        rota: rota,
        staff_member: shift.staff_member,
        starts_at: new_starts_at,
        ends_at: new_ends_at
      )
    end

    before do
      validator.validate
    end

    it 'should not produce a validation error' do
      expect(new_shift.errors[:base]).to include("Shift overlaps existing (1) shifts: #{starts_at.strftime("%H:%M")}-#{ends_at.strftime("%H:%M")}")
    end
  end

  context 'when new shift ends at overlaps start of existing shift' do
    let(:new_starts_at) { starts_at - 30.minutes }
    let(:new_ends_at) { starts_at }
    let(:new_shift) do
      RotaShift.new(
        rota: rota,
        staff_member: shift.staff_member,
        starts_at: new_starts_at,
        ends_at: new_ends_at
      )
    end

    before do
      validator.validate
    end

    it 'should not produce a validation error' do
      expect(new_shift.errors[:base]).to_not include("Shift overlaps existing (1) shifts: #{starts_at.strftime("%H:%M")}-#{ends_at.strftime("%H:%M")}")
    end
  end

  context 'when new shift starts at overlaps with end of existing shift' do
    let(:new_starts_at) { ends_at }
    let(:new_ends_at) { ends_at + 30.minutes }
    let(:new_shift) do
      RotaShift.new(
        rota: rota,
        staff_member: shift.staff_member,
        starts_at: new_starts_at,
        ends_at: new_ends_at
      )
    end

    before do
      validator.validate
    end

    it 'should not produce a validation error' do
      expect(new_shift.errors[:base]).to_not include("Shift overlaps existing (1) shifts: #{starts_at.strftime("%H:%M")}-#{ends_at.strftime("%H:%M")}")
    end
  end
end
