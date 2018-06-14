class AddIndexToStaffMemberBirthDayDate < ActiveRecord::Migration
  def change
    add_index :staff_members, :date_of_birth
  end
end
