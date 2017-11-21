class AddPasswordToStaffMember < ActiveRecord::Migration
  def change
    add_column :staff_members, :password_digest, :string 
  end
end
