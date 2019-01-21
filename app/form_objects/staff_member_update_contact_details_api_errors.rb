class StaffMemberUpdateContactDetailsApiErrors
  def initialize(staff_member:)
    @staff_member = staff_member
  end
  attr_reader :staff_member

  def errors
    result = {}

    result[:base] = staff_member.errors[:base] if staff_member.errors[:base].present?
    result[:phoneNumber] = staff_member.errors[:phone_number] if staff_member.errors[:phone_number].present?

    address = staff_member.address
    result[:address] = address.errors[:address] if address.errors[:address].present?
    result[:postcode] = address.errors[:postcode] if address.errors[:postcode].present?
    result[:country] = address.errors[:country] if address.errors[:country].present?
    result[:county] = address.errors[:county] if address.errors[:county].present?

    email_address = staff_member.email_address
    result[:emailAddress] = email_address.errors[:email] if email_address.errors[:email].present?

    result
  end
end
