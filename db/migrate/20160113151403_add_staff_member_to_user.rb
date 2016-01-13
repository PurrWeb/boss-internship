class AddStaffMemberToUser < ActiveRecord::Migration
  def change
    change_table :users do |t|
      t.integer :staff_member_id
      t.index :staff_member_id
    end
  end
end
