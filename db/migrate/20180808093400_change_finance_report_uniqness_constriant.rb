class ChangeFinanceReportUniqnessConstriant < ActiveRecord::Migration
  def change
    remove_index :finance_reports, [:week_start, :staff_member_id]
    add_index :finance_reports, [:week_start, :staff_member_id, :venue_id], name: 'dup_report_constraint'
  end
end
