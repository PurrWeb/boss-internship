class AddSiaFieldsToStaffMembers < ActiveRecord::Migration
  def change
    change_table :staff_members do |t|
      t.string :sia_badge_number
      t.date   :sia_badge_expiry_date

      t.index  :sia_badge_expiry_date
    end
  end
end
