class RefreshRepeatOffendersData < ActiveRecord::Migration
  def up
    ActiveRecord::Base.transaction do
      now = Time.current
      today = RotaShiftDate.to_rota_date(now)
      tax_year = TaxYear.new(today)

      TimeDodgerOffenceService.new(
        start_date: tax_year.start_date,
        end_date: tax_year.end_date,
      ).call

      RefreshTimeDodgerOffenceLevels.new(tax_year: tax_year).call
    end
  end
end
