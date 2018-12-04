class FillOutRepeatOffendersData < ActiveRecord::Migration
  def up
    ActiveRecord::Base.transaction do
      tax_year = TaxYear.new(Time.current.to_date)

      TimeDodgerOffenceService.new(
        start_date: tax_year.start_date,
        end_date: tax_year.end_date,
      ).call

      RecalculateOffenceLevel.new(tax_year: tax_year).call
    end
  end
end
