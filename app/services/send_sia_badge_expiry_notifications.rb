class SendSiaBadgeExpiryNotifications
  def initialize(now: Time.now)
    @now = now
  end

  def call
    security_staff_members = StaffMembersWithExpiringSiaBadgeQuery.new(
      now: now,
      relation: StaffMember.security
    ).all

    ActiveRecord::Base.transaction do
      security_staff_members.find_each do |staff_member|
        staff_member_email = staff_member.email
        sia_expiry_date = staff_member.sia_badge_expiry_date
        staff_member_name = staff_member.full_name
        managers = User.where('(role = ?) Or (role = ?)', 'admin', 'security_manager')

        SiaNotificationMailer.
          sia_expiry_notification_for_staff_member(
            staff_member_email: staff_member_email,
            sia_expiry_date: sia_expiry_date
          ).deliver_now

        SiaNotificationMailer.
          sia_expiry_notification_for_managers(
            staff_member_email: staff_member_email,
            sia_expiry_date: sia_expiry_date,
            staff_member_name: staff_member_name,
            manager_emails: managers.map(&:email)
          ).deliver_now
      end
      security_staff_members.update_all(notified_of_sia_expiry_at: now)
    end
  end

  private
  attr_reader :now
end
