class ClockInDaysPendingConfirmationQuery
  def initialize(venue:)
    @venue = venue
  end

  def all
    days_with_pending_hour_acceptances = ClockInDay.
      joins(:hours_acceptance_periods).
      merge(HoursAcceptancePeriod.pending)

    days_with_incomplete_clock_in_periods = ClockInDay.
      joins(:clock_in_periods).
      merge(ClockInPeriod.incomplete)

    ClockInDay.where(
      id: days_with_pending_hour_acceptances.pluck(:id) + days_with_incomplete_clock_in_periods.pluck(:id)
    )
  end

  private
  attr_reader :venue
end
