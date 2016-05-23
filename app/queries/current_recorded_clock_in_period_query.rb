class CurrentRecordedClockInPeriodQuery
  def initialize(venue:, staff_member:)
    @venue = venue
    @staff_member = staff_member
  end

  def first
    ClockInPeriod.
      where(
        venue: venue,
        staff_member: staff_member,
        ends_at: nil
      ).
      first
  end

  private
  attr_reader :staff_member, :venue
end
