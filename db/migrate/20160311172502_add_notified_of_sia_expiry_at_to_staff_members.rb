class AddNotifiedOfSiaExpiryAtToStaffMembers < ActiveRecord::Migration
  def change
    change_table :staff_members do |t|
      t.datetime :notified_of_sia_expiry_at
      t.index :notified_of_sia_expiry_at
    end

    staff_members = StaffMember.
      security.
      where('sia_badge_expiry_date < ?', Time.now)

    staff_members.update_all(notified_of_sia_expiry_at: Time.now)
  end
end
