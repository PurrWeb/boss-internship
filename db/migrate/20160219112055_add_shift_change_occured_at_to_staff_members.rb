class AddShiftChangeOccuredAtToStaffMembers < ActiveRecord::Migration
  def change
    change_table :staff_members do |t|
      t.datetime :shift_change_occured_at
      t.index :shift_change_occured_at
    end
  end
end
