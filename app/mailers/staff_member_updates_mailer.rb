class StaffMemberUpdatesMailer < ApplicationMailer
  def new_staff_member(staff_member)
    attachments["staff_member_#{staff_member.id}.pdf"] = {
      mime_type: 'application/pdf',
      content: StaffMemberDetailsPDF.new(staff_member).render
    }

    mail(
      to: staff_updates_email,
      subject: "New Staff Member Added - #{staff_member.full_name}"
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
