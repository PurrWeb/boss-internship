class ExtraFinanceReportIndexFixes < ActiveRecord::Migration
  def change
    add_index :holidays, [:start_date, :end_date, :staff_member_id]
    add_index :holidays, [:payslip_date, :staff_member_id]

    add_index :owed_hours, [:date, :staff_member_id]
    add_index :owed_hours, [:payslip_date, :staff_member_id]

    add_index :hours_acceptance_breaks, [:hours_acceptance_period_id, :disabled_at], name: 'break_period_disabled_at'

    add_index :staff_members, :starts_at
    add_index :staff_members, :master_venue_id

    add_index :staff_member_venues, [:staff_member_id, :venue_id]
  end
end
