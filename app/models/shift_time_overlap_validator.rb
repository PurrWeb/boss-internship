class ShiftTimeOverlapValidator
  def initialize(shift)
    @shift = shift
  end

  def validate
    if prerequisites_present?
      shift_query = ShiftInRangeQuery.new(
        staff_member: shift.staff_member,
        starts_at: shift.starts_at,
        ends_at: shift.ends_at
      ).all.enabled
      if shift.class == RotaShift && shift.persisted?
        shift_query = ExclusiveOfQuery.new(
          relation: shift_query,
          excluded: shift
        ).all
      end

      security_venue_shift_query = SecurityVenueShiftInRangeQuery.new(
        staff_member: shift.staff_member,
        starts_at: shift.starts_at,
        ends_at: shift.ends_at
      ).all.enabled
      if shift.class == SecurityVenueShift && shift.persisted?
        security_venue_shift_query = ExclusiveOfQuery.new(
          relation: security_venue_shift_query,
          excluded: shift
        ).all
      end

      if shift_query.count > 0
        overlapped_times = shift_query.map {|q| "#{q.starts_at.strftime("%H:%M")}-#{q.ends_at.strftime("%H:%M")}"}
        shift.errors.add(:base, "Shift overlaps existing (#{shift_query.count}) shifts: " + overlapped_times.join(", "))
      end

      if security_venue_shift_query.count > 0
        shift.errors.add(:base, 'shift overlaps existing security venue shift')
      end
    end
  end

  private
  attr_accessor :shift

  def prerequisites_present?
    shift.starts_at.present? &&
      shift.ends_at.present? &&
      shift.staff_member.present? &&
      shift.rota.present?
  end
end
