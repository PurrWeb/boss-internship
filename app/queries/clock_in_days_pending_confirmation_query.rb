class ClockInDaysPendingConfirmationQuery
  def initialize(venue:)
    @venue = venue
  end

  def all
    clock_in_days = ClockInDay.where(venue: @venue)

    days_with_pending_hour_acceptances = HoursAcceptancePeriod.where(
      clock_in_day: clock_in_days,
      status: HoursAcceptancePeriod::PENDING_STATE
    )

    days_with_incomplete_clock_in_periods = ClockInPeriod.where(
      clock_in_day: clock_in_days,
      ends_at: nil
    )

    ClockInDay.where(
      id: days_with_pending_hour_acceptances.map(&:clock_in_day_id) + days_with_incomplete_clock_in_periods.map(&:clock_in_day_id)
    )
  end

  private
  attr_reader :venue
end
