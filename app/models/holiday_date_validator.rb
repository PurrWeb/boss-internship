class HolidayDateValidator
  def initialize(holiday)
    @holiday = holiday
  end
  attr_reader :holiday

  def validate
    return unless holiday.enabled? && [:start_date, :end_date].all? do |method|
      holiday.public_send(method).present?
    end

    if holiday.start_date > holiday.end_date
      holiday.errors.add(:base, 'Start date cannot be after end date')
      return
    end

    overlapping_holidays = HolidayInRangeQuery.new(
      relation: Holiday.in_state(:enabled),
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

    if RotaWeek.new(holiday.start_date).start_date != RotaWeek.new(holiday.end_date).start_date
      holiday.errors.add(:base, "Holiday must be within a single week")
    end
  end
end
