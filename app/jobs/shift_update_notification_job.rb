class ShiftUpdateNotificationJob < RecurringJob
  def perform
    staff_members = StaffMemberWithShiftNotificationsQuery.new.all
    staff_members.find_each do |staff_member|
      SendShiftChangeNotifications.new(staff_member).call
    end
  end
end
