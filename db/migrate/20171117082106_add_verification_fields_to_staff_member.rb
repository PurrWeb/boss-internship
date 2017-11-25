class AddVerificationFieldsToStaffMember < ActiveRecord::Migration
  def change
    add_column :staff_members, :verification_token, :string, default: nil 
    add_column :staff_members, :verification_sent_at, :datetime, default: nil
    add_column :staff_members, :verified_at, :datetime, default: nil
    add_column :staff_members, :password_set_at, :datetime, default: nil
  end
end
