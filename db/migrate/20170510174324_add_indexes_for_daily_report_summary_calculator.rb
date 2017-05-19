class AddIndexesForDailyReportSummaryCalculator < ActiveRecord::Migration
  def change
    add_index(:staff_members, :pay_rate_id)
    add_index(:clock_in_days, :venue_id)
    add_index(:clock_in_days, :date)
    add_index(:hours_acceptance_breaks, :disabled_at)
    add_index(:clock_in_days, :staff_member_id)
  end
end
