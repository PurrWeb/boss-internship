class ShiftUpdateNotificationJob < ActiveJob::Base
  def perform
    job_time = Time.current
    staff_members = StaffMemberWithShiftNotificationsQuery.new.all
    staff_members.find_each do |staff_member|
      SendStaffMemberShiftUpdateJob.set(wait_until: job_time).perform_later(staff_member.id)
      job_time = job_time + 20.seconds
    end
  end
end
