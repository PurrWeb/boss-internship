class AddStaffTypeToStaffMembers < ActiveRecord::Migration
  def change
    change_table :staff_members do |t|
      t.integer :staff_type_id, null: false
      t.index :staff_type_id
    end
  end
end
