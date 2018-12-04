class StaffMembersAcceptedBreaksQuery
  def initialize(start_date:, end_date:, relation: StaffMember.all)
    @start_date = start_date
    @end_date = end_date
    @relation = relation
  end

  attr_reader :start_date, :end_date, :relation

  def all
    clocking_days = InRangeQuery.new(
      relation: ClockInDay.select("id"),
      start_value: start_date,
      end_value: end_date,
      start_column_name: "date",
      end_column_name: "date",
      include_boundaries: [:start, :end]
    ).all

    relation
      .joins(clock_in_days: {hours_acceptance_periods: :hours_acceptance_breaks})
      .where(hours_acceptance_periods: {status: HoursAcceptancePeriod::ACCEPTED_STATE})
      .where(hours_acceptance_breaks: {disabled_at: nil})
      .merge(clocking_days)
      .group("staff_members.id")
      .sum("TIMESTAMPDIFF(minute, hours_acceptance_breaks.starts_at, hours_acceptance_breaks.ends_at)")
  end
end
