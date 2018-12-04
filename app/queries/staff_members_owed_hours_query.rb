class StaffMembersOwedHoursQuery
  def initialize(start_date:, end_date:, relation: StaffMember.all)
    @start_date = start_date
    @end_date = end_date
    @relation = relation
  end

  attr_reader :start_date, :end_date, :relation

  def all
    owed_hours = InRangeQuery.new(
      relation: OwedHour.enabled,
      start_value: start_date,
      end_value: end_date,
      start_column_name: "date",
      end_column_name: "date",
      include_boundaries: [:start, :end],
    ).all

    relation
      .joins(:owed_hours)
      .merge(owed_hours)
      .group("staff_members.id")
      .sum("TIMESTAMPDIFF(minute, owed_hours.starts_at, owed_hours.ends_at)")
  end
end
