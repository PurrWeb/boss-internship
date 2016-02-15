class HolidayReportsDataQuery
  def initialize(date:, venue:)
    @date = date
    @venue = venue
  end

  def holidays
    return Holiday.none unless venue

    @holidays ||= begin
      relation = Holiday.
        in_state(:enabled).
        joins(:staff_member).
        merge(StaffMember.for_venue(venue))

      HolidayInRangeQuery.new(
        relation: relation,
        start_date: week.start_date,
        end_date: week.end_date
      ).all
    end
  end

  def staff_members
    return StaffMember.none unless venue

    @staff_members ||= StaffMember.
      for_venue(venue).
      joins(:holidays).
      merge(Holiday.in_state(:enabled))
  end

  def week
    @week ||= RotaWeek.new(date)
  end

  attr_reader :date, :venue
end
