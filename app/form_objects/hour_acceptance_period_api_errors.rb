class HourAcceptancePeriodApiErrors
  def initialize(hour_acceptance_period:, breaks:)
    @hour_acceptance_period = hour_acceptance_period
    @breaks = breaks
  end
  attr_reader :hour_acceptance_period, :breaks

  def errors
    result = {}
    result[:breaks] = breaks.map do |period_break|
      errors = {}
      errors[:startsAt] = period_break.errors[:starts_at] if period_break.errors[:starts_at].present?
      errors[:endsAt] = period_break.errors[:ends_at] if period_break.errors[:ends_at].present?
      errors[:base] = period_break.errors[:base] if period_break.errors[:base].present?
      errors
    end

    result[:startsAt] = hour_acceptance_period.errors[:starts_at] if hour_acceptance_period.errors[:starts_at].present?
    result[:endsAt] = hour_acceptance_period.errors[:ends_at] if hour_acceptance_period.errors[:ends_at].present?

    result
  end
end
