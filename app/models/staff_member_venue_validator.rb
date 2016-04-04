class StaffMemberVenueValidator
  def initialize(staff_member)
    @staff_member = staff_member
  end

  def validate
    if staff_member.staff_type.present?
      if security_staff_with_venue?(staff_member)
        staff_member.errors.add(:venues, 'must be blank for security')
      elsif non_security_staff_without_venue?(staff_member)
        staff_member.errors.add(:venues, 'cannot be blank')
      end
    end
  end

  private
  attr_reader :staff_member

  def security_staff_with_venue?(staff_member)
    staff_member.staff_type.security? &&
      staff_member.venues.length > 0
  end

  def non_security_staff_without_venue?(staff_member)
    !staff_member.staff_type.security? &&
      staff_member.venues.length == 0
  end
end
