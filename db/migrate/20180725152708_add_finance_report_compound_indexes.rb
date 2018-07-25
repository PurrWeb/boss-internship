class AddFinanceReportCompoundIndexes < ActiveRecord::Migration
  def change
    add_index :hours_acceptance_periods, [:status, :clock_in_day_id]
    add_index :clock_in_days, [:venue_id, :staff_member_id, :date]
    add_index :clock_in_periods, [:clock_in_day_id, :ends_at]
    add_index :payments, [:disabled_at, :staff_member_id, :date]
  end
end
