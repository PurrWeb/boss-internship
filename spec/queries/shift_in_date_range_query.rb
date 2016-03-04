require 'rails_helper'

describe ShiftInRangeQuery do
  let(:shift) do
    FactoryGirl.create(
      :rota_shift,
      rota: rota,
      starts_at: starts_at,
      ends_at: ends_at
    )
  end
  let(:rota) { FactoryGirl.create(:rota, date: Time.now) }
  let(:staff_member) { shift.staff_member }
  let(:starts_at) { (rota.date.beginning_of_day + 5.hours).utc }
  let(:ends_at) { (rota.date.beginning_of_day + 6.hours).utc }
  let(:query) do
    ShiftInRangeQuery.new(
      starts_at: query_starts_at,
      ends_at: query_ends_at,
      staff_member: query_staff_member
    )
  end
  let(:query_rota) { rota }
  let(:query_staff_member) { staff_member }
  let(:query_starts_at) { starts_at }
  let(:query_ends_at) { ends_at }

  describe 'supplied date range' do
    context 'when range exactly matches matches shift times' do
      specify 'shift should be returned' do
        expect(query.all).to eq([shift])
      end
    end

    context 'range is before shift time' do
      let(:query_starts_at) { starts_at - 15.minutes }
      let(:query_ends_at) { starts_at - 1.hour }

      specify 'shift should not be returned' do
        expect(query.all).to eq([])
      end
    end

    context 'range is after shift time' do
      let(:query_starts_at) { ends_at + 15.minutes }
      let(:query_ends_at) { ends_at + 1.hour }

      specify 'shift should not be returned' do
        expect(query.all).to eq([])
      end
    end

    context 'range is within shift times' do
      let(:query_starts_at) { starts_at + 15.minutes }
      let(:query_ends_at) { ends_at - 15.minutes }

      specify 'shift should be returned' do
        expect(query.all).to eq([shift])
      end
    end

    context 'range encompasses shift times' do
      let(:query_starts_at) { starts_at - 15.minutes }
      let(:query_ends_at) { ends_at + 15.minutes }

      specify 'shift should be returned' do
        expect(query.all).to eq([shift])
      end
    end

    context 'range starts_at overlaps shift times' do
      let(:query_starts_at) { ends_at - 15.minutes }
      let(:query_ends_at) { ends_at + 15.minutes }

      specify 'shift should be returned' do
        expect(query.all).to eq([shift])
      end
    end

    context 'range ends_at overlaps shift times' do
      let(:query_starts_at) { starts_at - 15.minutes }
      let(:query_ends_at) { starts_at + 15.minutes }

      specify 'shift should be returned' do
        expect(query.all).to eq([shift])
      end
    end
  end

  context 'when supplied staff member does not match existing shift' do
    let(:query_staff_member) { FactoryGirl.create(:staff_member) }

    specify 'shift should not be returned' do
      expect(query.all).to eq([])
    end
  end

  context 'when supplied rota member does not match existing shift' do
    let(:query_rota) { FactoryGirl.create(:rota) }

    specify 'shift should still be returned' do
      expect(query.all).to eq([shift])
    end
  end
end
