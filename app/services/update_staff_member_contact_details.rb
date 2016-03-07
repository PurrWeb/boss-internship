class UpdateStaffMemberContactDetails
  class Result < Struct.new(:success, :staff_member)
    def success?
      success
    end
  end

  def initialize(staff_member:, email:, phone_number:, address:)
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

    result = staff_member.save

    Result.new(result, staff_member)
  end

  private
  attr_reader :staff_member, :email, :address, :phone_number
end
