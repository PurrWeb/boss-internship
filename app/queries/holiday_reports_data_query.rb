class HolidayReportsDataQuery
  def initialize(date)
    @date = date
  end

  def holidays
    @holidays ||= HolidayInRangeQuery.new(
      relation: Holiday.in_state(:enabled),
      start_date: week.start_date,
      end_date: week.end_date
    ).all
  end

  def staff_members
    @staff_members ||= StaffMember.joins(:holidays).merge(holidays)
  end

  def week
    @week ||= RotaWeek.new(date)
  end

  attr_reader :date
end
