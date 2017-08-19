class StaffMemberUpdateAvatarApiErrors
  def initialize(staff_member:)
    @staff_member = staff_member
  end
  attr_reader :staff_member

  def errors
    result = {}

    result[:base] = staff_member.errors[:base] if staff_member.errors[:base].present?
    result[:avatar] = staff_member.errors[:avatar] if staff_member.errors[:avatar].present?

    result
  end
end
