require 'rails_helper'

RSpec.describe TaxYear do
  describe 'self.deadline for year' do
    let(:years) { [2000, 2017] }

    specify 'should be 9th of april that year' do
      years.each do |year|
        expect(TaxYear.deadline_for_year(year)).to eq(Date.new(year, 4, 9))
      end
    end
  end

  describe 'year' do
    context 'date after calendar year deadilne' do
      let(:calendar_year) { 2012 }
      let(:date) { Date.new(calendar_year, 5, 1) }

      specify 'prerequsite should be true' do
        expect(date).to be > TaxYear.deadline_for_year(date.year)
      end

      it 'year should match calendar year' do
        expect(TaxYear.new(date).year).to eq(calendar_year)
      end
    end

    context 'date before calendar year deadilne' do
      let(:calendar_year) { 2012 }
      let(:date) { Date.new(calendar_year, 2, 1) }

      specify 'prerequsite should be true' do
        expect(date).to be < TaxYear.deadline_for_year(date.year)
      end

      it 'year should match calendar year' do
        expect(TaxYear.new(date).year).to eq(calendar_year - 1)
      end
    end
  end

  describe 'start_date' do
    let(:calendar_year) { 2012 }
    let(:year) { TaxYear.new(date) }

    context 'date is before tax deadline' do
      let(:date) { Date.new(calendar_year, 2, 1) }

      specify 'prerequsite should be true' do
        expect(date).to be < TaxYear.deadline_for_year(date.year)
      end

      specify 'start_date is the previous calendar year tax deadline' do
        expect(year.start_date).to eq(year.last_calendar_year_tax_deadline)
      end
    end

    context 'date is after tax deadline' do
      let(:date) { Date.new(calendar_year, 5, 1) }

      specify 'prerequsite should be true' do
        expect(date).to be > TaxYear.deadline_for_year(date.year)
      end

      specify 'start_date is the previous calendar year tax deadline' do
        expect(year.start_date).to eq(year.calendar_year_tax_deadline)
      end
    end
  end

  describe 'end_date' do
    let(:calendar_year) { 2012 }
    let(:year) { TaxYear.new(date) }

    context 'date is before tax deadline' do
      let(:date) { Date.new(calendar_year, 2, 1) }

      specify 'prerequsite should be true' do
        expect(date).to be < TaxYear.deadline_for_year(date.year)
      end

      specify 'end_date is the current calendar year tax deadline' do
        expect(year.end_date).to eq(year.calendar_year_tax_deadline)
      end
    end

    context 'date is after tax deadline' do
      let(:date) { Date.new(calendar_year, 5, 1) }

      specify 'prerequsite should be true' do
        expect(date).to be > TaxYear.deadline_for_year(date.year)
      end

      specify 'end_date is the next calendar year tax deadline' do
        expect(year.end_date).to eq(year.next_calendar_year_tax_deadline)
      end
    end
  end

  describe "self#for_year" do
    let(:year) { 3011 }

    specify do
      expect(TaxYear.for_year(year).start_date.year).to eq(year)
    end
  end

  describe "self#last_tax_year" do
    specify do
      current_tax_year = TaxYear.new(Time.current)

      expect(TaxYear.last_tax_year.year).to eq(current_tax_year.year - 1)
    end
  end
end
