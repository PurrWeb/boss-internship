class RefreshRepeatOffendersData < ActiveRecord::Migration
  def up
    ActiveRecord::Base.transaction do
      now = Time.current
      today = RotaShiftDate.to_rota_date(now)
      monday_tax_year = MondayTaxYear.new(today)
      start_date = monday_tax_year.start_date
      end_date = monday_tax_year.end_date

      TimeDodgerOffenceService.new(
        start_date: start_date,
        end_date: end_date,
      ).call

      RefreshTimeDodgerOffenceLevels.new(monday_tax_year: monday_tax_year).call
    end
  end
end
