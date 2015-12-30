class AddAvatarColumnToStaffMembersTable < ActiveRecord::Migration
  def change
    change_table :staff_members do |t|
      t.string :avatar
    end
  end
end
