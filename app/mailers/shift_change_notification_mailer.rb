class ShiftChangeNotificationMailer < ApplicationMailer
  def notify_of_shift_change_mail(staff_member_id:, now: Time.now)
    staff_member = StaffMember.find(staff_member_id)

    upcoming_shifts = UpcomingPublishedShiftQuery.new(staff_member: staff_member).all

    mail(
      to: staff_member.email,
      subject: 'Boss: Your shifts have changed'
    ) do |format|
      format.html do
        render locals: {
          staff_member: staff_member,
          shifts_by_week: RotaShiftsByWeek.new(upcoming_shifts)
        }
      end

      format.text do
        render locals: {
          staff_member: staff_member,
          shifts_by_week: RotaShiftsByWeek.new(upcoming_shifts)
        }
      end
    end
  end
end
