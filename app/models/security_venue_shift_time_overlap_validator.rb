class SecurityVenueShiftTimeOverlapValidator
  def initialize(shift)
    @shift = shift
  end

  def validate
    if prerequisites_persent?
      shift_query = ShiftInRangeQuery.new(
        staff_member: shift.staff_member,
        starts_at: shift.starts_at,
        ends_at: shift.ends_at
      ).all.enabled

      security_venue_shift_query = SecurityVenueShiftInRangeQuery.new(
        staff_member: shift.staff_member,
        starts_at: shift.starts_at,
        ends_at: shift.ends_at
      ).all.enabled

      if shift.persisted?
        shift_query = ExclusiveOfQuery.new(
          relation: shift_query,
          excluded: shift
        ).all

        security_venue_shift_query = ExclusiveOfQuery.new(
          relation: security_venue_shift_query,
          excluded: shift
        ).all
      end

      if shift_query.count > 0
        shift.errors.add(:base, 'security venue shift overlaps existing shift')
      end

      if security_venue_shift_query.count > 0
        shift.errors.add(:base, 'security venue shift overlaps existing security venue shift')
      end
    end
  end

  private
  attr_accessor :shift

  def prerequisites_persent?
    shift.starts_at.present? &&
      shift.ends_at.present? &&
      shift.staff_member.present?
  end
end
