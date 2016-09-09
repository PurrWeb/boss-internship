class HolidayDateValidator
  def initialize(holiday)
    @holiday = holiday
    @now = Time.current
  end
  attr_reader :holiday, :now

  def validate
    return unless holiday.enabled? && [:start_date, :end_date].all? do |method|
      holiday.public_send(method).present?
    end

    if holiday.start_date > holiday.end_date
      holiday.errors.add(:base, 'Start date cannot be after end date')
      return
    end

    if RotaWeek.new(holiday.start_date).start_date != RotaWeek.new(holiday.end_date).start_date
      holiday.errors.add(:base, "Holiday must be within a single week")
    end

    if holiday.validate_as_creation
      if holiday.start_date < RotaShiftDate.to_rota_date(now)
        holiday.errors.add(:base, "can't create holidays in the past")
        return
      end
    else
      current_rota_date = RotaShiftDate.to_rota_date(now)
      start_date_moved_to_past = holiday.start_date_changed? && (
        holiday.start_date < current_rota_date
      )
      end_date_moved_to_past = holiday.end_date_changed? && (
        holiday.end_date < current_rota_date
      )

      if start_date_moved_to_past
        holiday.errors.add(:start_date, "can't be changed to date in the past")
      end
      if end_date_moved_to_past
        holiday.errors.add(:end_date, "can't be changed to date in the past")
      end

      return if start_date_moved_to_past || end_date_moved_to_past
    end

    staff_member_holidays = Holiday.
      in_state(:enabled).
      where(staff_member: holiday.staff_member)

    overlapping_holidays = HolidayInRangeQuery.new(
      relation: staff_member_holidays,
      start_date: holiday.start_date,
      end_date: holiday.end_date
    ).all

    overlapping_holidays_exclusive = ExclusiveOfQuery.new(
      relation: overlapping_holidays,
      excluded: holiday
    ).all

    if overlapping_holidays_exclusive.present?
      holiday.errors.add(:base, 'Holiday conflicts with an existing holiday')
    end

    conflicting_shifts = ShiftInDateRangeQuery.new(
      staff_member: holiday.staff_member,
      start_date: holiday.start_date,
      end_date: holiday.end_date
    ).all

    if conflicting_shifts.present?
      holiday.errors.add(:base, 'Staff member is assigned shifts on one of these days')
    end
  end

  def dates_changed?(holiday)
    holiday.changed.include?(:start_date) || holiday.changed.include?(:end_date)
  end
end
