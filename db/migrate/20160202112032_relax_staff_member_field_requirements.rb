class RelaxStaffMemberFieldRequirements < ActiveRecord::Migration
  def change
    change_column_null :staff_members, :address_id, true
    change_column_null :staff_members, :phone_number, true
    change_column_null :staff_members, :date_of_birth, true
    change_column_null :staff_members, :email_address_id, true
  end
end
