class AddIndexForTokenToStaffMembers < ActiveRecord::Migration
  def change
    add_index :staff_members, :verification_token
  end
end
