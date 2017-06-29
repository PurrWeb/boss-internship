class AddRollbarGuidToStaffMember < ActiveRecord::Migration
  def change
    add_column :staff_members, :rollbar_guid, :string

    StaffMember.transaction do
      StaffMember.find_each do |staff_member|
        staff_member.rollbar_guid = SecureRandom.uuid
        staff_member.save!
      end
    end 
  end
end
