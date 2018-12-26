class AddGuidToStaffMemebers < ActiveRecord::Migration
  def change
    change_table :staff_members do |t|
      t.string :id_scanner_guid
    end
    StaffMember.enabled.find_each do |staff_member|
      staff_member.update_attribute(:id_scanner_guid, SecureRandom.uuid)
    end
  end
end
