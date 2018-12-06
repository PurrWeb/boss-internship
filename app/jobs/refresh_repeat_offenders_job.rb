class RefreshRepeatOffendersJob < ActiveJob::Base
  def perform
    ActiveRecord::Base.transaction do
      now = Time.current
      today = RotaShiftDate.to_rota_date(now)

      start_date = RotaWeek.new(today - 2.weeks).start_date
      end_date = RotaWeek.new(today - 1.weeks).end_date

      current_tax_year = MondayTaxYear.new(start_date)
      next_tax_year = nil

      if !current_tax_year.contains_date?(end_date)
        next_tax_year = MondayTaxYear.new(end_date)
      end

      TimeDodgerOffenceService.new(
        start_date: start_date,
        end_date: end_date,
      ).call

      RefreshTimeDodgerOffenceLevels.new(monday_tax_year: current_tax_year).call
      if next_tax_year.present?
        RefreshTimeDodgerOffenceLevels.new(monday_tax_year: next_tax_year).call
      end
    end
  end
end
