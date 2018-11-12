class MigrateLegacyHapRecords < ActiveRecord::Migration
  def change
    HoursAcceptancePeriod.
      enabled.
      where(finance_report: FinanceReport.in_state(:done)).
      update_all(allow_legacy_seconds_in_times: true)

    HoursAcceptanceBreak.
      enabled.
      joins(hours_acceptance_period: :finance_report).
      where(hours_acceptance_periods: {finance_report_id: FinanceReport.in_state(:done)}).
      update_all(allow_legacy_seconds_in_times: true)
  end
end
