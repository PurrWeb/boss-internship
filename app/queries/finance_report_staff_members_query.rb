class FinanceReportStaffMembersQuery
  def initialize(venue:, week:)
    @venue = venue
    @week = week
  end
  attr_reader :venue, :week

  def all
    staff_member_transitions = Arel::Table.new(:staff_member_transitions)
    most_recent_staff_member_transitions = staff_member_transitions.alias('most_recent_staff_member_transition')
    staff_members = Arel::Table.new(:staff_members)
    holidays = Arel::Table.new(:holidays)
    owed_hours = Arel::Table.new(:owed_hours)
    clock_in_days = Arel::Table.new(:clock_in_days)
    holiday_transitions_table = Arel::Table.new(:holiday_transitions)
    holiday_transitions = holiday_transitions_table.alias("holiday_transitions")

    paid_holidays_query = holidays.
      join(holiday_transitions, Arel::Nodes::OuterJoin).
      on(
        holiday_transitions[:holiday_id].eq(holidays[:id]).
        and(
          holiday_transitions[:most_recent].eq(1)
        )
      ).
      where(
        holidays[:holiday_type].eq(Holiday::PAID_HOLIDAY_TYPE).
        and(
          holiday_transitions[:to_state].eq(nil).
          or(
            holiday_transitions[:to_state].eq("enabled")
          )
        )
      ).
      project(
        holidays[Arel.star]
      )
    paid_holidays = paid_holidays_query.as("paid_holidays")

    enabled_owed_hours_query = owed_hours.
      where(
        owed_hours[:disabled_at].not_eq(nil)
      ).
      project(
        owed_hours[Arel.star]
      )
    enabled_owed_hours = enabled_owed_hours_query.as("enabled_owed_hours")

    query = staff_members.
      join(most_recent_staff_member_transitions, Arel::Nodes::OuterJoin).
      on(
        staff_members[:id].eq(
          most_recent_staff_member_transitions[:staff_member_id]
        ).
        and(
          most_recent_staff_member_transitions[:most_recent].eq(1)
        )
      ).
      join(paid_holidays, Arel::Nodes::OuterJoin).
      on(
        staff_members[:id].eq(paid_holidays[:staff_member_id])
      ).
      join(enabled_owed_hours, Arel::Nodes::OuterJoin).
      on(
        staff_members[:id].eq(enabled_owed_hours[:staff_member_id])
      ).
      join(clock_in_days, Arel::Nodes::OuterJoin).
      on(
        staff_members[:id].eq(clock_in_days[:staff_member_id])
      ).
      where(
        staff_members[:master_venue_id].eq(venue.id).
        and(
          staff_members[:created_at].lt(
            RotaShiftDate.new(week.start_date + 1.week).start_time
          )
        )
      ).
      where(
        most_recent_staff_member_transitions[:to_state].eq(nil).
        or(
          most_recent_staff_member_transitions[:to_state].eq("enabled")
        ).
        or(
          InRangeInclusive.new(
            start_column: paid_holidays[:start_date],
            end_column: paid_holidays[:end_date],
            start_value: week.start_date,
            end_value: week.end_date
          ).arel
        ).
        or(
          InRangeInclusive.new(
            start_column: enabled_owed_hours[:week_start_date],
            end_column: enabled_owed_hours[:week_start_date],
            start_value: week.start_date,
            end_value: week.end_date
          ).arel
        ).
        or(
          InRangeInclusive.new(
            start_column: clock_in_days[:date],
            end_column: clock_in_days[:date],
            start_value: week.start_date,
            end_value: week.end_date
          ).arel
        )
      ).
      project(staff_members[Arel.star]).
      distinct

    StaffMember.find_by_sql(query.to_sql)
  end
end
