class AddEmploymentStatementCompletedToStaffMembers < ActiveRecord::Migration
  def change
    change_table :staff_members do |t|
      t.boolean :employment_status_statement_completed, null: false, default: false
    end
  end
end
