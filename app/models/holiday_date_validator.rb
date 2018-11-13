class HolidayDateValidator
  CONFLICTING_HOURS_VALIDATION_MESSAGE = 'Staff member has hours accepted for the day in question'
  CONFLICTING_OWED_HOURS_VALIDATION_MESSAGE = 'Staff member is assigned owed hours on one of these days'
  CONFLICTING_ROTA_SHIFT_VALIDATION_MESSAGE = 'Staff member is assigned shifts on one of these days'
  CONFLICTING_HOLIDAY_REQUEST_VALIDATION_MESSAGE = 'Holiday conflicts with an existing holiday request'
  CONFLICTING_HOLIDAY_VALIDATION_MESSAGE = 'Holiday conflicts with an existing holiday'
  DATE_IN_PAST_CREATION_VALIDATION_MESSAGE = "can't be changed to date in the past"

  def initialize(holiday)
    @holiday = holiday
    @now = Time.current
  end
  attr_reader :holiday, :now

  def validate
    return unless holiday.enabled?

    date_validations_failed = false
    if dates_present?
      if holiday.start_date > holiday.end_date
        holiday.errors.add(:base, 'Start date cannot be after end date')
        date_validations_failed = true
      end

      if !date_validations_failed && RotaWeek.new(holiday.start_date).start_date != RotaWeek.new(holiday.end_date).start_date
        holiday.errors.add(:base, "Holiday must be within a single week")
        date_validations_failed = true
      end
    end

    # Don't bother with the rest if we have more major issues
    return if date_validations_failed

    if dates_present? && holiday.staff_member.present?
      staff_member_holidays = holiday.
        staff_member.
        holidays.
        in_state(:enabled)

      if !holiday.allow_legacy_conflicting_holiday?
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
          holiday.errors.add(:base, CONFLICTING_HOLIDAY_VALIDATION_MESSAGE)
        end
      end

      if !holiday.allow_legacy_conflicting_holiday_request?
        staff_member_holiday_requests = holiday.
          staff_member.
          holiday_requests.
          in_state(:pending)

        if holiday.source_request.present?
          # Ignore request holiday will be replacing
          staff_member_holidays = ExclusiveOfQuery.new(
            relation: staff_member_holiday_requests,
            excluded: holiday.source_request
          )
        end

        overlapping_holiday_requests = HolidayInRangeQuery.new(
          relation: staff_member_holiday_requests,
          start_date: holiday.start_date,
          end_date: holiday.end_date
        ).all

        if overlapping_holiday_requests.present? && !holiday.validate_as_assignment
          holiday.errors.add(:base, CONFLICTING_HOLIDAY_REQUEST_VALIDATION_MESSAGE)
        end
      end

      if !holiday.allow_legacy_conflicting_rota_shift?
        conflicting_shifts = ShiftInDateRangeQuery.new(
          staff_member: holiday.staff_member,
          start_date: holiday.start_date,
          end_date: holiday.end_date
        ).all

        if conflicting_shifts.present?
          holiday.errors.add(:base, CONFLICTING_ROTA_SHIFT_VALIDATION_MESSAGE)
        end
      end

      if !holiday.allow_legacy_conflicting_owed_hours?
        conflicting_owed_hours = InRangeQuery.new(
          relation: holiday.staff_member.active_owed_hours,
          start_value: holiday.start_date,
          end_value: holiday.end_date,
          start_column_name: 'date',
          end_column_name: 'date'
        ).all

        if conflicting_owed_hours.present?
          holiday.errors.add(:base, CONFLICTING_OWED_HOURS_VALIDATION_MESSAGE)
        end
      end

      if !holiday.allow_legacy_overlap_accepted_hours?
        conflicting_hours_acceptance_periods = InRangeQuery.new(
          relation: holiday.staff_member.hours_acceptance_periods.accepted,
          start_value: RotaShiftDate.new(holiday.start_date).start_time,
          end_value: RotaShiftDate.new(holiday.end_date).end_time,
          start_column_name: 'starts_at',
          end_column_name: 'starts_at'
        ).all

        if conflicting_hours_acceptance_periods.present?
          holiday.errors.add(:base, CONFLICTING_HOURS_VALIDATION_MESSAGE)
        end
      end
    end
  end

  def dates_present?
    holiday.start_date.present? && holiday.end_date.present?
  end

  def dates_changed?(holiday)
    holiday.changed.include?(:start_date) || holiday.changed.include?(:end_date)
  end
end
