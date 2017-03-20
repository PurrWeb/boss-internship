require 'rails_helper'

describe Holiday do
  describe 'type filtering' do
    let(:paid_holiday) do
      FactoryGirl.create(:holiday, holiday_type: Holiday::PAID_HOLIDAY_TYPE)
    end

    let(:unpaid_holidays) do
      Holiday::UNPAID_HOLIDAY_TYPES.map do |unpaid_holiday_type|
        FactoryGirl.create(:holiday, holiday_type: unpaid_holiday_type)
      end
    end

    before do
      paid_holiday
      unpaid_holidays
    end

    describe '#paid?' do
      specify 'should be true for paid holidays' do
        expect(paid_holiday.paid?).to eq(true)
      end

      specify 'should be false for unpaid holidays' do
        unpaid_holidays.each do |unpaid_holiday|
          expect(unpaid_holiday.paid?).to eq(false)
        end
      end
    end

    describe 'self#paid' do
      specify 'should include paid holidays' do
        expect(Holiday.paid).to include(paid_holiday)
      end

      specify 'should include not all unpaid holidays' do
        unpaid_holidays.each do |unpaid_holiday|
          expect(Holiday.paid).to_not include(unpaid_holiday)
        end
      end
    end

    describe 'self#unpaid' do
      specify 'should include not paid holidays' do
        expect(Holiday.unpaid).to_not include(paid_holiday)
      end

      specify 'should include all unpaid holidays' do
        unpaid_holidays.each do |unpaid_holiday|
          expect(Holiday.unpaid).to include(unpaid_holiday)
        end
      end
    end
  end
end
