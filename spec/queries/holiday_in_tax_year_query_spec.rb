require 'rails_helper'

RSpec.describe HolidayInTaxYearQuery do
  include ActiveSupport::Testing::TimeHelpers

  let(:now) { Time.zone.now }
  let(:tax_year_start_date) { tax_year.start_date }
  let(:staff_member_start_date) { tax_year.start_date }
  let(:tax_year) { TaxYear.new(now.to_date) }
  let(:query) do
    HolidayInTaxYearQuery.new(
      tax_year: tax_year,
      relation: relation
    )
  end
  let(:relation) { Holiday.all }
  let(:result) { query.all }
  let(:create_existing_holidays) { existing_holidays }

  before do
    create_existing_holidays
  end

  context 'holidays exists outside of tax year' do
    let(:existing_holidays) do
      travel_to tax_year_start_date - 2.weeks do
        date = tax_year_start_date - 1.day
        2.times do
          FactoryGirl.create(
            :holiday,
            start_date: date,
            end_date: date
          )
          date = date - 1.day
        end
      end
    end

    specify 'holidays should not be returned' do
      expect(result.to_a.map(&:id)).to eq([])
    end
  end

  context 'holidays exist inside of tax year' do
    result = []
    let(:existing_holidays) do
      travel_to tax_year_start_date - 2.weeks do
        date = tax_year_start_date + 1.day
        2.times do
          result << FactoryGirl.create(
            :holiday,
            start_date: date,
            end_date: date
          )
          date = date + 1.day
        end
      end
      result
    end

    specify 'holidays should be returned' do
      expect(result.to_a.map(&:id)).to eq(existing_holidays.map(&:id))
    end
  end

  context 'when staff_member_start_date is supplied' do
    let(:staff_member_start_date) { tax_year_start_date + 4.weeks }
    let(:query) do
      HolidayInTaxYearQuery.new(
        tax_year: tax_year,
        relation: relation,
        staff_member_start_date: staff_member_start_date
      )
    end
    let(:before_start_date_holidays) do
      travel_to tax_year_start_date - 2.weeks do
        date = tax_year_start_date + 1.day
        2.times do
          result << FactoryGirl.create(
            :holiday,
            start_date: date,
            end_date: date
          )
          date = date + 1.day
        end
      end
      result
    end
    let(:after_start_date_holidays) do
      travel_to tax_year_start_date - 2.weeks do
        date = staff_member_start_date
        2.times do
          result << FactoryGirl.create(
            :holiday,
            start_date: date,
            end_date: date
          )
          date = date + 1.day
        end
      end
      result
    end
    let(:existing_holidays) do
      before_start_date_holidays
      after_start_date_holidays
    end

    specify 'existing holidays after start date should be returned' do
      expect(result.to_a.map(&:id)).to eq(after_start_date_holidays.map(&:id))
    end
  end
end
