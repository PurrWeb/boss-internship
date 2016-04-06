class RemoveSoftDeleteFromStaffMemberVenues < ActiveRecord::Migration
  def change
    change_table :staff_member_venues do |t|
      t.remove :enabled
    end
  end
end
