class MigrateStaffMembersEnabledData < ActiveRecord::Migration
  def change
    ActiveRecord::Base.transaction do
      StaffMember.find_each do |staff_member|
        if !staff_member.enabled?
          staff_member.state_machine.transition_to!(:disabled)
        end
      end
    end
  end
end
