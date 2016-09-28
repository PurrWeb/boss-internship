class OverheadStaffMemberQuery
  def initialize(venue:, date:)
    @venue = venue
    @week = RotaWeek.new(date)
  end
  attr_reader :venue, :week

  def all
    StaffMember.
      enabled.
      where(master_venue: venue).
      where('`staff_members`.created_at < ?', week.start_date).
      joins(:pay_rate).
      merge(PayRate.weekly)
  end
end
