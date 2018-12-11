class StaffMembersPaidHolidaysQuery
  def initialize(start_date:, end_date:, relation: StaffMember.all)
    @start_date = start_date
    @end_date = end_date
    @relation = relation
  end

  attr_reader :start_date, :end_date, :relation

  def all
    holidays = InRangeQuery.new(
      relation: Holiday.in_state(:enabled).where(holiday_type: Holiday::PAID_HOLIDAY_TYPE),
      start_value: start_date,
      end_value: end_date,
      start_column_name: "start_date",
      end_column_name: "end_date",
      include_boundaries: [:start, :end],
    ).all

    relation
      .joins(:holidays)
      .merge(holidays)
      .group("staff_members.id")
      .sum("TIMESTAMPDIFF(day, holidays.start_date, holidays.end_date) + 1")
  end
end
