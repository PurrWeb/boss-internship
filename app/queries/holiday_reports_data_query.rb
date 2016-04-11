class HolidayReportsDataQuery
  def initialize(week:, venues:)
    @week = week
    @venues = venues
  end

  def holidays
    @holidays ||= begin
      relation = Holiday.
        in_state(:enabled)

      if venues.present?
        relation = relation.
          joins(:staff_member).
          merge(
            StaffMember.
              joins(:venues).
              merge(venues)
          )
      end

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

  attr_reader :week, :venues
end
