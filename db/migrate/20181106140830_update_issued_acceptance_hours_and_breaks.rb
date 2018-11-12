class UpdateIssuedAcceptanceHoursAndBreaks < ActiveRecord::Migration
  def change
    HoursAcceptancePeriod
      .enabled
      .where(finance_report: nil)
      .where("SECOND(hours_acceptance_periods.starts_at) > 0 OR SECOND(hours_acceptance_periods.ends_at) > 0")
      .update_all(
        "starts_at = DATE_FORMAT(hours_acceptance_periods.starts_at, '%Y-%m-%d %H:%i:00'), ends_at = DATE_FORMAT(hours_acceptance_periods.ends_at, '%Y-%m-%d %H:%i:00')"
      )
    HoursAcceptancePeriod
      .enabled
      .where(finance_report: FinanceReport.not_in_state(:done))
      .where("SECOND(hours_acceptance_periods.starts_at) > 0 OR SECOND(hours_acceptance_periods.ends_at) > 0")
      .update_all(
        "starts_at = DATE_FORMAT(hours_acceptance_periods.starts_at, '%Y-%m-%d %H:%i:00'), ends_at = DATE_FORMAT(hours_acceptance_periods.ends_at, '%Y-%m-%d %H:%i:00')"
      )
    HoursAcceptanceBreak
      .enabled
      .joins(hours_acceptance_period: :finance_report)
      .where("SECOND(hours_acceptance_breaks.starts_at) > 0 OR SECOND(hours_acceptance_breaks.ends_at) > 0")
      .where(hours_acceptance_periods: {finance_report_id: nil})
      .update_all(
        "hours_acceptance_breaks.starts_at = DATE_FORMAT(hours_acceptance_breaks.starts_at, '%Y-%m-%d %H:%i:00'), hours_acceptance_breaks.ends_at = DATE_FORMAT(hours_acceptance_breaks.ends_at, '%Y-%m-%d %H:%i:00')"
      )
    HoursAcceptanceBreak
      .enabled
      .joins(hours_acceptance_period: :finance_report)
      .where("SECOND(hours_acceptance_breaks.starts_at) > 0 OR SECOND(hours_acceptance_breaks.ends_at) > 0")
      .where(hours_acceptance_periods: {finance_report_id: FinanceReport.not_in_state(:done)})
      .update_all(
        "hours_acceptance_breaks.starts_at = DATE_FORMAT(hours_acceptance_breaks.starts_at, '%Y-%m-%d %H:%i:00'), hours_acceptance_breaks.ends_at = DATE_FORMAT(hours_acceptance_breaks.ends_at, '%Y-%m-%d %H:%i:00')"
      )
  end
end
