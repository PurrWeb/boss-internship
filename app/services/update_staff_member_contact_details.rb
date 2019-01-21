class UpdateStaffMemberContactDetails
  class Result < Struct.new(:success, :staff_member)
    def success?
      success
    end
  end

  def initialize(requester:, staff_member:, email:, phone_number:, address:)
    @requester = requester
    @staff_member = staff_member
    @email = email
    @phone_number = phone_number
    @address = address
  end

  def call
    if !(staff_member.email == email)
      unused_email_address = EmailAddressNotInUse.new.find(email)

      if unused_email_address.present?
        staff_member.email_address = unused_email_address
      else
        staff_member.email_address = EmailAddress.new(email: email)
      end
    end

    staff_member.phone_number = phone_number

    if !(staff_member.address == address)
      staff_member.address = address
    end

    staff_member_updates_email = StaffMemberUpdatesEmail.new(
      user: requester,
      old_master_venue: staff_member.master_venue,
      staff_member: staff_member
    )

    result = staff_member.save

    if result && staff_member_updates_email.send?
      # StaffMemberUpdatesMailer.staff_member_updated(staff_member_updates_email.data).deliver_now
    end

    Result.new(result, staff_member)
  end

  private
  attr_reader :staff_member, :email, :address, :phone_number, :requester
end
