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

  def staff_member_updated(data)
    staff_member_name = data.fetch(:staff_member_name)
    staff_member_id = data.fetch(:staff_member_id)

    time_stamp = Time.zone.now.strftime('%d_%m_%Y_%H_%M')
    attachments["staff_member_#{staff_member_id}_#{time_stamp}.pdf"] = {
      mime_type: 'application/pdf',
      content: StaffMemberUpdateDetailsPDF.new(
        staff_member_name: staff_member_name,
        changed_attributes: data.fetch(:changed_attribute_data)
      ).render
    }

    mail(
      to: staff_updates_email,
      subject: "Staff Member Updated - #{staff_member_name}"
    ) do |format|
      format.html do
        render locals: { staff_member_name: staff_member_name }
      end
    end
  end

  def staff_member_disabled(staff_member)
    mail(
      to: staff_updates_email,
      subject: "Staff Member Disabled - #{staff_member.full_name.titlecase}"
    ) do |format|
      format.html do
        render locals: { staff_member: staff_member }
      end
    end
  end

  private
  def staff_updates_email
    'staffupdates@jsmbars.co.uk'
  end
end
