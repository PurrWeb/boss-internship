class FixStaffMemberDateOfBirth < ActiveRecord::Migration
  def change
    change_column :staff_members, :date_of_birth, :date
  end
end
