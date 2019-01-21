class StaffMemberUpdatePersonalDetailsApiErrors
  def initialize(staff_member:)
    @staff_member = staff_member
  end
  attr_reader :staff_member

  def errors
    result = {}

    result[:base] = staff_member.errors[:base] if staff_member.errors[:base].present?
    result[:gender] = staff_member.errors[:gender] if staff_member.errors[:gender].present?
    result[:dateOfBirth] = staff_member.errors[:date_of_birth] if staff_member.errors[:date_of_birth].present?

    name = staff_member.name
    result[:firstName] = name.errors[:first_name] if name.errors[:first_name].present?
    result[:surname] = name.errors[:surname] if name.errors[:surname].present?

    result
  end
end
