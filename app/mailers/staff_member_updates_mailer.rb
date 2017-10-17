class StaffMemberUpdatesMailer < ApplicationMailer
  def new_staff_member(staff_member)
    attachments["staff_member_#{staff_member.id}.pdf"] = {
      mime_type: 'application/pdf',
      content: NewStaffMemberDetailsPDF.new(staff_member).render
    }

    mail(
      to: staff_updates_email,
      subject: "New Staff Member Added - #{staff_member.full_name.titlecase}"
    ) do |format|
      format.html do
        render locals: { staff_member: staff_member }
      end
    end
  end

  def staff_member_revived(data)
    user_name = data.fetch(:user_name)
    staff_member = data.fetch(:staff_member)
    update_time = data.fetch(:update_time)

    attachments["staff_member_#{staff_member.id}.pdf"] = {
      mime_type: 'application/pdf',
      content: NewStaffMemberDetailsPDF.new(staff_member).render
    }

    mail(
      to: staff_updates_email,
      subject: "Staff Member Re-enabled: #{staff_member.full_name.titlecase}"
    ) do |format|
      format.html do
        render locals: { staff_member: staff_member, user_name: user_name, update_time: update_time }
      end
    end
  end

  def staff_member_updated(data)
    user_name = data.fetch(:user_name)
    staff_member_name = data.fetch(:staff_member_name)
    staff_member_id = data.fetch(:staff_member_id)

    now = Time.zone.now

    time_stamp = now.strftime('%d_%m_%Y_%H_%M')
    attachments["staff_member_#{staff_member_id}_#{time_stamp}.pdf"] = {
      mime_type: 'application/pdf',
      content: StaffMemberUpdateDetailsPDF.new(
        user_name: user_name,
        staff_member_name: staff_member_name,
        staff_member_id: staff_member_id,
        changed_attributes: data.fetch(:changed_attributes),
        old_values: data.fetch(:old_values),
        new_values: data.fetch(:new_values),
        update_time: now
      ).render
    }

    mail(
      to: staff_updates_email,
      subject: "Staff Member Updated - #{staff_member_name}"
    ) do |format|
      format.html do
        render locals: { user_name: user_name, staff_member_name: staff_member_name, update_time: now }
      end
    end
  end

  def staff_member_disabled(data)
    staff_member = data.fetch(:staff_member)
    user_name = data.fetch(:user_name)
    update_time = data.fetch(:update_time)

    mail(
      to: staff_updates_email,
      subject: "Staff Member Disabled - #{staff_member.full_name.titlecase}"
    ) do |format|
      format.html do
        render locals: { user_name: user_name, staff_member: staff_member, update_time: update_time}
      end
    end
  end

  private
  def staff_updates_email
    'staffupdates@jsmbars.co.uk'
  end
end
