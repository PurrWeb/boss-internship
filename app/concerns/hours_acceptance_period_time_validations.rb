module HoursAcceptancePeriodTimeValidations
  extend ActiveSupport::Concern

  included do
    validate :times_in_correct_order
    validate :times_within_correct_day
    validate :times_overlap_validations
    validate :starts_at_is_minute
    validate :ends_at_is_minute
  end

  # validation
  def times_in_correct_order
    if starts_at.present? && ends_at.present?
      errors.add(:starts_at, " must be before end time") if starts_at > ends_at
      errors.add(:ends_at, " must be after start time") if ends_at < starts_at
    end
  end

  def starts_at_is_minute
    if !allow_legacy_seconds_in_times && starts_at.present?
      errors.add(:starts_at, 'must be a minute') if starts_at.sec > 0
    end
  end

  def ends_at_is_minute
    if !allow_legacy_seconds_in_times && ends_at.present?
      errors.add(:ends_at, "must be a minute") if ends_at.sec > 0
    end
  end

  #validation
  def times_within_correct_day
    if clock_in_day.present?
      if starts_at.present? && (starts_at < RotaShiftDate.new(clock_in_day.date).start_time)
        errors.add(:starts_at, "time #{starts_at} suppiled too early for #{clock_in_day.date}")
      end

      if ends_at.present? && (ends_at < RotaShiftDate.new(clock_in_day.date).start_time)
        errors.add(:ends_at, "time #{ends_at} suppiled too early for #{clock_in_day.date}")
      end

      if starts_at.present? && (starts_at > RotaShiftDate.new(clock_in_day.date).end_time)
        errors.add(:starts_at, "time #{starts_at} suppiled too late for #{clock_in_day.date}")
      end

      if ends_at.present? && (ends_at > RotaShiftDate.new(clock_in_day.date).end_time)
        errors.add(:ends_at, "time #{ends_at} suppiled too late for #{clock_in_day.date}")
      end
    end
  end
end
