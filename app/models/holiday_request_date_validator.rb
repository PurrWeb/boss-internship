class HolidayRequestDateValidator
  def initialize(holiday_request, now = Time.current)
    @holiday_request = holiday_request
    @now = now
  end
  attr_reader :holiday_request, :now

  def validate
    return unless [:start_date, :end_date].all? do |method|
      holiday_request.public_send(method).present?
    end
    return unless state_subject_to_date_validation(holiday_request.current_state)

    if holiday_request.start_date > holiday_request.end_date
      holiday_request.errors.add(:base, 'Start date cannot be after end date')
      return
    end

    if RotaWeek.new(holiday_request.start_date).start_date != RotaWeek.new(holiday_request.end_date).start_date
      holiday_request.errors.add(:base, "Holiday must be within a single week")
    end

    staff_member_holidays = Holiday.
      in_state(:enabled).
      where(staff_member: holiday_request.staff_member)

    overlapping_holidays = HolidayInRangeQuery.new(
      relation: staff_member_holidays,
      start_date: holiday_request.start_date,
      end_date: holiday_request.end_date
    ).all

    if holiday_request.created_holiday
      overlapping_holidays = ExclusiveOfQuery.new(
        relation: overlapping_holidays,
        excluded: holiday_request.created_holiday
      ).all
    end

    if overlapping_holidays.present?
      holiday_request.errors.add(:base, 'Request conflicts with an existing holiday')
    end

    staff_member_holiday_requests = HolidayRequest
      .in_state(:pending)
      .where(staff_member: holiday_request.staff_member)
      .where.not(id: holiday_request.id)

    overlapping_holiday_requests = HolidayInRangeQuery.new(
      relation: staff_member_holiday_requests,
      start_date: holiday_request.start_date,
      end_date: holiday_request.end_date
    ).all

    if overlapping_holiday_requests.present?
      holiday_request.errors.add(:base, 'Holiday conflicts with an existing holiday request')
    end

    conflicting_shifts = ShiftInDateRangeQuery.new(
      staff_member: holiday_request.staff_member,
      start_date: holiday_request.start_date,
      end_date: holiday_request.end_date
    ).all

    if conflicting_shifts.present?
      holiday_request.errors.add(:base, 'Staff member is assigned shifts on one of these days')
    end

    conflicting_owed_hours = InRangeQuery.new(
      relation: holiday_request.staff_member.active_owed_hours,
      start_value: holiday_request.start_date,
      end_value: holiday_request.end_date,
      start_column_name: 'date',
      end_column_name: 'date'
    ).all

    if conflicting_owed_hours.present?
      holiday_request.errors.add(:base, 'Staff member is assigned owed hours on one of these days')
    end
  end

  def state_subject_to_date_validation(state)
    case state
    when 'pending', 'accepted'
      true
    when 'rejected', 'disabled'
      false
    else
      raise "unsupported state #{state} encountered"
    end
  end
end
