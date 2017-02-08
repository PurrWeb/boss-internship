require 'rails_helper'

RSpec.describe TaxYear do
  let(:year) { TaxYear.new(date) }

  describe 'start_date' do
    context 'date is before tax deadline' do
      specify 'start_date is the previous calendar year tax deadline' do
        expect(year.start_date).to eq(year.last_calendar_year_tax_dealine)
      end
    end

    context 'date is after tax deadline' do
      specify 'start_date is the previous calendar year tax deadline' do
        expect(year.start_date).to eq(year.current_calendar_year_tax_dealine)
      end
    end
  end

  describe 'end_date' do
    context 'date is before tax deadline' do
      specify 'end_date is the current calendar year tax deadline' do
        expect(year.start_date).to eq(year.current_calendar_year_tax_dealine)
      end
    end

    context 'date is after tax deadline' do
      specify 'start_date is the next calendar year tax deadline' do
        expect(year.start_date).to eq(year.next_calendar_year_tax_dealine)
      end
    end
  end
end
