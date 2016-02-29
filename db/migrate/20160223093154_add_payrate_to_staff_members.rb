class AddPayrateToStaffMembers < ActiveRecord::Migration
  def change
    change_table :staff_members do |t|
      t.integer :pay_rate_id, null: false
    end
  end
end
