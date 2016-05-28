class PeriodTimeOverlapValidator
  def initialize(period)
    @period = period
  end

  def validate
    if prerequisites_persent?
      relation = period.class.
        joins(:clock_in_day).
        merge(
          ClockInDay.
          where(
            staff_member: staff_member,
            date: date
          )
        )
      relation = relation.enabled if relation.respond_to?(:enabled)

      query = InRangeQuery.new(
        relation: relation,
        start_value: starts_at,
        end_value: ends_at,
        include_boundaries: false
      ).all

      if period.persisted?
        query = ExclusiveOfQuery.new(
          relation: query,
          excluded: period
        ).all
      end

      if query.count > 0
        period.errors.add(:base, 'period overlaps existing period')
      end
    end
  end

  private
  attr_accessor :period

  def prerequisites_persent?
    starts_at.present? &&
    ends_at.present? &&
    staff_member.present? &&
    clock_in_day.present?
  end

  def starts_at
    period.starts_at
  end

  def ends_at
    period.ends_at
  end

  def staff_member
    period.staff_member
  end

  def clock_in_day
    period.clock_in_day
  end

  def date
    clock_in_day.date
  end
end
