class RemoveEnabledFieldFromStaffMembers < ActiveRecord::Migration
  def change
    change_table :staff_members do |t|
      t.remove :enabled
    end
  end
end
