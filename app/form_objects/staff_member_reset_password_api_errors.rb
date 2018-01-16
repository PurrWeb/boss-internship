class StaffMemberResetPasswordApiErrors
  def initialize(staff_member:)
    @staff_member = staff_member
  end
  attr_reader :staff_member

  def errors
    result = {}
    result[:base] = staff_member.errors[:base] if staff_member.errors[:base].present?
    result[:password] = staff_member.errors[:password] if staff_member.errors[:password].present?
    result[:passwordConfirmation] = staff_member.errors[:password_confirmation] if staff_member.errors[:password_confirmation].present?
    result
  end
end
