class SecurityStaffMemberValidator
  def initialize(staff_member)
    @staff_member = staff_member
  end

  def validate
    if staff_member.staff_type.present? && staff_member.staff_type.security?
      if staff_member.staff_member_venue.present? && !staff_member.staff_member_venue.marked_for_destruction?
        staff_member.errors.add(:venue, 'must be blank for security')
      end
    end
  end

  private
  attr_accessor :staff_member
end
