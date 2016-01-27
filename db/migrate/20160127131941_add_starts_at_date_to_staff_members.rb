class AddStartsAtDateToStaffMembers < ActiveRecord::Migration
  def change
    change_table :staff_members do |t|
      t.date :starts_at
    end
    StaffMember.update_all(starts_at: Time.now)
    change_column_null :staff_members, :starts_at, false
  end
end
