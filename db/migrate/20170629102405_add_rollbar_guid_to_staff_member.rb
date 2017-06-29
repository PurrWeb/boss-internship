class AddRollbarGuidToStaffMember < ActiveRecord::Migration
  def change
    add_column :staff_members, :rollbar_guid, :string

    StaffMember.reset_column_information
    StaffMember.transaction do
      StaffMember.find_each do |staff_member|
        staff_member.rollbar_guid = SecureRandom.uuid
        staff_member.save!
      end
    end 

    change_column_null :staff_members, :rollbar_guid, false
  end
end
