class AddIndexToStaffMembers < ActiveRecord::Migration
  def change
    add_index :staff_members, :name_id
  end
end
