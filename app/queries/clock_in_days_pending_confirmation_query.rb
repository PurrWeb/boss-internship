class ClockInDaysPendingConfirmationQuery
  def initialize(venue:)
    @venue = venue
  end

  def all
    clock_in_days = ClockInDay.where(venue: @venue)

    days_with_pending_hour_acceptances = HoursAcceptancePeriod.pending.where(
      clock_in_day: clock_in_days
    )

    days_with_incomplete_clock_in_periods = ClockInPeriod.incomplete.where(
      clock_in_day: clock_in_days
    )

    ClockInDay.where(
      id: days_with_pending_hour_acceptances.map(&:clock_in_day_id) + days_with_incomplete_clock_in_periods.map(&:clock_in_day_id)
    )
  end

  private
  attr_reader :venue
end
