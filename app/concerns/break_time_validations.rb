module BreakTimeValidations
  extend ActiveSupport::Concern

  included do
    validate :times_in_correct_order
    validate :times_within_correct_day
    validate do |_break|
      BreakTimeOverlapValidator.new(_break: _break, break_class: _break.class, period_association: period_association).validate
    end
    validate do |_break|
      BreakWithinParentTimeframeValidator.new(_break: _break, break_class: _break.class, period_association: period_association).validate
    end
  end

  def period_association
    case self
    when ClockInBreak
      :clock_in_period
    when HoursAcceptanceBreak
      :hours_acceptance_period
    else
      raise "unsupported break type: #{self.class.name}"
    end
  end

  # validation
  def times_in_correct_order
    if starts_at.present? && ends_at.present?
      errors.add(:starts_at, "can't be after or equal end time") if starts_at >= ends_at
      errors.add(:ends_at, "can't be before or equal start time") if ends_at <= starts_at
    end
  end

  #validation
  def times_within_correct_day
    period = public_send(period_association)

    if period.present?
      if starts_at.present? && (starts_at < RotaShiftDate.new(period.date).start_time)
        raise "starts_at time #{starts_at} suppiled too early for #{period.date}"
      end

      if ends_at.present? && (ends_at < RotaShiftDate.new(period.date).start_time)
        raise "ends_at time #{ends_at} suppiled too early for #{period.date}"
      end

      if starts_at.present? && (starts_at > RotaShiftDate.new(period.date).end_time)
        raise "starts_at time #{starts_at} suppiled too late for #{period.date}"
      end

      if ends_at.present? && (ends_at > RotaShiftDate.new(period.date).end_time)
        raise "ends_at time #{ends_at} suppiled too late for #{period.date}"
      end
    end
  end
end
