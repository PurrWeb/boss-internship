module PeriodTimeValidations
  extend ActiveSupport::Concern

  included do
    validate :times_in_correct_order
    validate :times_within_correct_day
    validate do |period|
      PeriodTimeOverlapValidator.new(period).validate
    end
  end

  # validation
  def times_in_correct_order
    if starts_at.present? && ends_at.present?
      errors.add(:base, 'starts_at must be after ends_at') if starts_at >= ends_at
    end
  end

  #validation
  def times_within_correct_day
    if clock_in_day.present?
      if starts_at.present? && (starts_at < RotaShiftDate.new(clock_in_day.date).start_time)
        raise "starts_at time #{starts_at} suppiled too early for #{clock_in_day.date}"
      end

      if ends_at.present? && (ends_at < RotaShiftDate.new(clock_in_day.date).start_time)
        raise "ends_at time #{ends_at} suppiled too early for #{clock_in_day.date}"
      end

      if starts_at.present? && (starts_at > RotaShiftDate.new(clock_in_day.date).end_time)
        raise "starts_at time #{starts_at} suppiled too late for #{clock_in_day.date}"
      end

      if ends_at.present? && (ends_at > RotaShiftDate.new(clock_in_day.date).end_time)
        raise "ends_at time #{ends_at} suppiled too late for #{clock_in_day.date}"
      end
    end
  end
end
