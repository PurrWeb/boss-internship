class ShiftTimeOverlapValidator
  def initialize(shift)
    @shift = shift
  end

  def validate
    if prerequisites_persent?
      query = ShiftInRangeQuery.new(
        staff_member: shift.staff_member,
        starts_at: shift.starts_at,
        ends_at: shift.ends_at
      ).all.enabled

      if shift.persisted?
        query = ExclusiveOfQuery.new(
          relation: query,
          excluded: shift
        ).all
      end

      if query.count > 0
        shift.errors.add(:base, 'shift overlaps existing shift')
      end
    end
  end

  private
  attr_accessor :shift

  def prerequisites_persent?
    shift.starts_at.present? &&
      shift.ends_at.present? &&
      shift.staff_member.present? &&
      shift.rota.present?
  end
end
