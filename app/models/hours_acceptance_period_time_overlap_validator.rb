class HoursAcceptancePeriodTimeOverlapValidator
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

      if !period.allow_legacy_overlap_accepted_hours?
        relation = relation.enabled.accepted

        query = InRangeQuery.new(
          relation: relation,
          start_value: starts_at,
          end_value: ends_at,
          include_boundaries: []
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

      if !period.allow_legacy_conflicting_owed_hours?
        conflicting_owed_hours = InRangeQuery.new(
          relation: staff_member.active_owed_hours,
          start_value: starts_at,
          end_value: ends_at
        ).all

        if conflicting_owed_hours.count > 0
          period.errors.add(:base, 'conflicting owed hour exists')
        end
      end

      if !period.allow_legacy_conflicting_holiday?
        conflicting_holidays = HolidayInRangeQuery.new(
          relation: staff_member.holidays.in_state(:enabled),
          start_date: date,
          end_date: date
        ).all

        if conflicting_holidays.count > 0
          period.errors.add(:base, 'conflicting holidays exist')
        end
      end
    end
  end

  private
  attr_accessor :period

  def prerequisites_persent?
    starts_at.present?
    ends_at.present? &&
    staff_member.present? &&
    clock_in_day.present? &&
    period.enabled? &&
    period.accepted?
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
