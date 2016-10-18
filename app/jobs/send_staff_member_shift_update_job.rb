class SendStaffMemberShiftUpdateJob < ActiveJob::Base
  def perform(staff_member_id)
    staff_member = StaffMember.enabled.find_by(id: staff_member_id)
    SendShiftChangeNotifications.new(staff_member).call if staff_member.present?
  end
end
