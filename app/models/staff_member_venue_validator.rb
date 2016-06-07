class StaffMemberVenueValidator
  def initialize(staff_member)
    @staff_member = staff_member
  end

  def validate
    if staff_member.staff_type.present?
      if security_staff?(staff_member)
        staff_member.errors.add(:master_venue, 'must be blank') if staff_member.master_venue.present?
      else
        staff_member.errors.add(:master_venue, 'cannot be blank') if !staff_member.master_venue.present?

        if staff_member.work_venues.include?(staff_member.master_venue)
          staff_member.errors.add(:work_venues, 'cannot contain main venue')
        end
      end
    end
  end

  private
  attr_reader :staff_member

  def security_staff?(staff_member)
    staff_member.staff_type.security?
  end
end
