class HolidayReportsDataQuery
  def initialize(week:, venue:)
    @week = week
    @venue = venue
  end

  def holidays
    @holidays ||= begin
      relation = Holiday.
        in_state(:enabled)

      if venue.present?
        relation = relation.
          joins(:staff_member).
          merge(StaffMember.for_venue(venue))
      end

      HolidayInRangeQuery.new(
        relation: relation,
        start_date: week.start_date,
        end_date: week.end_date
      ).all
    end
  end

  def staff_members
    @staff_members ||= begin
      result = StaffMember.
        joins(:holidays).
        merge(Holiday.in_state(:enabled))

      if venue.present?
        result = result.for_venue(venue)
      end
      result
    end
  end

  attr_reader :week, :venue
end
