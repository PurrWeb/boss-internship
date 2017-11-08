class HolidayReportsDataQuery
  def initialize(week:, venue:)
    @week = week
    @venue = venue
  end

  def holidays
    @holidays ||= begin
      relation = Holiday.
        in_state(:enabled)

      relation = relation.
        joins(:staff_member).
        merge(
          StaffMember.
            where(master_venue: venue)
        )

      HolidayInRangeQuery.new(
        relation: relation,
        start_date: week.start_date,
        end_date: week.end_date
      ).all
    end
  end

  def staff_members
    StaffMember.
      joins(:holidays).
      merge(holidays)
  end

  attr_reader :week, :venue
end
