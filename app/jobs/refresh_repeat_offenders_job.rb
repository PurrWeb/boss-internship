class RefreshRepeatOffendersJob < ActiveJob::Base
  def perform
    ActiveRecord::Base.transaction do
      now = Time.current
      today = RotaShiftDate.to_rota_date(now)

      current_week = RotaWeek.new(today)
      two_week_before_week = RotaWeek.new(current_week.start_date - 2.weeks)
      one_week_before_week = RotaWeek.new(current_week.start_date - 1.week)

      start_date = two_week_before_week.start_date
      end_date = one_week_before_week.end_date

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
