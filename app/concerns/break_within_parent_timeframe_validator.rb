class BreakWithinParentTimeframeValidator
  OUTSIDE_OF_PERIOD_VALIDATION_MESSAGE = "can't be outside of parent period"

  def initialize(_break:, break_class:, period_association:)
    @_break = _break
    @break_class = break_class
    @period_association = period_association
  end
  attr_reader :_break, :break_class, :period_association

  def validate
    if prerequisites_persent?
      if starts_at < parent.starts_at || starts_at > parent.ends_at
        _break.errors.add(:starts_at, OUTSIDE_OF_PERIOD_VALIDATION_MESSAGE)
      end
      if ends_at < parent.starts_at || ends_at > parent.ends_at
        _break.errors.add(:ends_at, OUTSIDE_OF_PERIOD_VALIDATION_MESSAGE)
      end
    end
  end

  def prerequisites_persent?
    !break_disabled? &&
      starts_at.present? &&
      ends_at.present? &&
      parent.present? &&
      parent.starts_at.present? &&
      parent.ends_at.present?
  end

  def starts_at
    _break.starts_at
  end

  def ends_at
    _break.ends_at
  end

  def parent
    _break.public_send(period_association)
  end

  def break_disabled?
    _break.disabled?
  end
end
