# Returns all staff members rotead or with clocked in for a given day with totals ffor hours worked and hours rotaed
class DailyReportsIndexStaffMemberQuery
  def initialize(date:, venue:)
    @date = date
    @venue = venue
  end
  attr_reader :date, :venue

  def all
    staff_members = Arel::Table.new(:staff_members)
    rota_shifts = Arel::Table.new(:rota_shifts)
    rotas = Arel::Table.new(:rotas)
    clock_in_days = Arel::Table.new(:clock_in_days)
    hours_acceptance_periods = Arel::Table.new(:hours_acceptance_periods)
    hours_acceptance_breaks = Arel::Table.new(:hours_acceptance_breaks)
    pay_rates = Arel::Table.new(:pay_rates)

    week = RotaWeek.new(date)
    rota = Rota.find_by(date: date, venue: venue)

    rota_shifts_with_durations_query = rota_shifts.
      where(rota_shifts[:rota_id].eq(rota.andand.id)).
      where(rota_shifts[:enabled].eq(true)).
      project(
        rota_shifts[:staff_member_id].as("staff_member_id"),
        ArelHelpers.duration_in_hours_column(
          start_column: rota_shifts[:starts_at],
          end_column: rota_shifts[:ends_at]
        ).sum.as("duration")
      ).
      group("staff_member_id")

    week_rotas_query = rotas.
      where(
        InRangeInclusive.new(
          start_column: rotas[:date],
          end_column: rotas[:date],
          start_value: week.start_date,
          end_value: week.end_date
        ).arel
      ).
      project(
        rotas[:id]
      )
    week_rotas = week_rotas_query.as("week_rotas")

    week_shifts_with_durations_query = rota_shifts.
      join(week_rotas).
      on(
        rota_shifts[:rota_id].eq(week_rotas[:id])
      ).
      where(rota_shifts[:enabled].eq(true)).
      project(
        rota_shifts[:staff_member_id].as("staff_member_id"),
        ArelHelpers.duration_in_hours_column(
          start_column: rota_shifts[:starts_at],
          end_column: rota_shifts[:ends_at]
        ).sum.as("duration")
      ).
      group("staff_member_id")

    rota_clock_in_days_query = clock_in_days.
      where(
        clock_in_days[:date].eq(date).
        and(
          clock_in_days[:venue_id].eq(venue.id)
        )
      ).
      project(
        clock_in_days[:id],
        clock_in_days[:staff_member_id]
      )
    rota_clock_in_days = rota_clock_in_days_query.as("rota_clock_in_days")

    rota_hours_acceptance_periods_with_durations_query = hours_acceptance_periods.
      join(rota_clock_in_days).
      on(
        rota_clock_in_days[:id].eq(hours_acceptance_periods[:clock_in_day_id])
      ).
      where(
        hours_acceptance_periods[:status].eq(HoursAcceptancePeriod::ACCEPTED_STATE)
      ).
      project(
        rota_clock_in_days[:staff_member_id].as("staff_member_id"),
        hours_acceptance_periods[:id].as("id"),
        Arel::Nodes::NamedFunction.new(
          "SUM",
          [
            ArelHelpers.value_or_zero(
              ArelHelpers.duration_in_hours_column(
                start_column: hours_acceptance_periods[:starts_at],
                end_column: hours_acceptance_periods[:ends_at]
              ),
            )
          ],
          "duration"
        ),
      ).
      group("staff_member_id")

    rota_hours_acceptance_periods_breaks_join = rota_hours_acceptance_periods_with_durations_query.as("hours_acceptance_periods_breaks_join")
    rota_hours_acceptance_breaks_with_durations_query = hours_acceptance_breaks.
      join(rota_hours_acceptance_periods_breaks_join).
      on(
        rota_hours_acceptance_periods_breaks_join[:id].eq(hours_acceptance_breaks[:hours_acceptance_period_id])
      ).
      where(
        hours_acceptance_breaks[:disabled_at].eq(nil)
      ).
      project(
        rota_hours_acceptance_periods_breaks_join[:staff_member_id].as("staff_member_id"),
        ArelHelpers.duration_in_hours_column(
          start_column: hours_acceptance_breaks[:starts_at],
          end_column: hours_acceptance_breaks[:ends_at]
        ).sum.as("duration")
      ).
      group("staff_member_id")


    week_clock_in_days_query = clock_in_days.
      where(
        InRangeInclusive.new(
          start_column: clock_in_days[:date],
          end_column: clock_in_days[:date],
          start_value: week.start_date,
          end_value: week.end_date
        ).arel
      ).
      project(
        clock_in_days[:id],
        clock_in_days[:staff_member_id]
      )
    week_clock_in_days = week_clock_in_days_query.as("week_clock_in_days")

    week_hours_acceptance_periods_with_durations_query = hours_acceptance_periods.
      join(week_clock_in_days).
      on(
        week_clock_in_days[:id].eq(hours_acceptance_periods[:clock_in_day_id])
      ).
      where(
        hours_acceptance_periods[:status].eq(HoursAcceptancePeriod::ACCEPTED_STATE)
      ).
      project(
        week_clock_in_days[:staff_member_id].as("staff_member_id"),
        hours_acceptance_periods[:id].as("id"),
        Arel::Nodes::NamedFunction.new(
          "SUM",
          [
            ArelHelpers.value_or_zero(
              ArelHelpers.duration_in_hours_column(
                start_column: hours_acceptance_periods[:starts_at],
                end_column: hours_acceptance_periods[:ends_at]
              )
            )
          ],
          "duration"
        ),
      ).
      group("staff_member_id")
    week_hours_acceptance_periods_with_durations = week_hours_acceptance_periods_with_durations_query.as("week_hours_acceptance_periods_with_durations")

    week_hours_acceptance_periods_breaks_join = week_hours_acceptance_periods_with_durations_query.as("hours_acceptance_periods_breaks_join")
    week_hours_acceptance_breaks_with_durations_query = hours_acceptance_breaks.
      join(week_hours_acceptance_periods_breaks_join).
      on(
        week_hours_acceptance_periods_breaks_join[:id].eq(hours_acceptance_breaks[:hours_acceptance_period_id])
      ).
      where(
        hours_acceptance_breaks[:disabled_at].eq(nil)
      ).
      project(
        week_hours_acceptance_periods_breaks_join[:staff_member_id].as("staff_member_id"),
        Arel::Nodes::NamedFunction.new(
          "SUM",
          [
            ArelHelpers.value_or_zero(
              ArelHelpers.duration_in_hours_column(
                start_column: hours_acceptance_breaks[:starts_at],
                end_column: hours_acceptance_breaks[:ends_at]
              )
            )
          ],
          "duration"
        ),
      ).
      group("staff_member_id")

    week_hours_acceptance_breaks_with_durations = week_hours_acceptance_breaks_with_durations_query.as("week_hours_acceptance_breaks_with_durations")

    rota_hours_acceptance_periods_with_durations = rota_hours_acceptance_periods_with_durations_query.as("rota_hours_acceptance_periods_with_durations")
    rota_hours_acceptance_breaks_with_durations = rota_hours_acceptance_breaks_with_durations_query.as("rota_hours_acceptance_breaks_with_durations")
    rota_shifts_with_durations = rota_shifts_with_durations_query.as("rota_shifts_with_durations")
    week_shifts_with_durations = week_shifts_with_durations_query.as("week_shifts_with_durations")

    staff_members_query = staff_members.
      join(rota_shifts_with_durations, Arel::Nodes::OuterJoin).
      on(
        rota_shifts_with_durations[:staff_member_id].eq(staff_members[:id])
      ).
      join(week_shifts_with_durations, Arel::Nodes::OuterJoin).
      on(
        week_shifts_with_durations[:staff_member_id].eq(staff_members[:id])
      ).
      join(rota_hours_acceptance_periods_with_durations, Arel::Nodes::OuterJoin).
      on(
        rota_hours_acceptance_periods_with_durations[:staff_member_id].eq(staff_members[:id])
      ).
      join(rota_hours_acceptance_breaks_with_durations, Arel::Nodes::OuterJoin).
      on(
        rota_hours_acceptance_breaks_with_durations[:staff_member_id].eq(staff_members[:id])
      ).
      join(week_hours_acceptance_periods_with_durations, Arel::Nodes::OuterJoin).
      on(
        week_hours_acceptance_periods_with_durations[:staff_member_id].eq(
          staff_members[:id]
        )
      ).
      join(week_hours_acceptance_breaks_with_durations, Arel::Nodes::OuterJoin).
      on(
        week_hours_acceptance_breaks_with_durations[:staff_member_id].eq(
          staff_members[:id]
        )
      ).
      join(clock_in_days, Arel::Nodes::OuterJoin).
      on(
        clock_in_days[:staff_member_id].eq(staff_members[:id])
      ).
      join(pay_rates).
      on(
       staff_members[:pay_rate_id].eq(pay_rates[:id])
      ).
      where(
        rota_shifts_with_durations[:staff_member_id].not_eq(nil).
        or(
          rota_hours_acceptance_periods_with_durations[:staff_member_id].not_eq(nil)
        ).
        or(
          clock_in_days[:id].not_eq(nil).
          and(
            clock_in_days[:date].eq(date)
          ).
          and(
            clock_in_days[:venue_id].eq(venue.id)
          )
        )
      )


    staff_members_with_hours_query = staff_members_query.
      project(
        staff_members[Arel.star],
        pay_rates[:calculation_type].as('calculation_type'),
        (pay_rates[:cents] / 100).as('pay_rate_in_pounds'),
        ArelHelpers.value_or_zero(
          rota_shifts_with_durations[:duration],
          as: "hours_rotaed"
        ),
        ArelHelpers.value_or_zero(
          week_shifts_with_durations[:duration],
          as: "week_hours_rotaed"
        ),
        ArelHelpers.value_or_zero(
          rota_hours_acceptance_periods_with_durations[:duration],
          as: "hours_worked",
        ),
        ArelHelpers.value_or_zero(
          rota_hours_acceptance_breaks_with_durations[:duration],
          as: "break_hours"
        ),
        ArelHelpers.value_or_zero(
          week_hours_acceptance_periods_with_durations[:duration],
          as: "week_hours_worked"
        ),
        ArelHelpers.value_or_zero(
          week_hours_acceptance_breaks_with_durations[:duration],
          as: "week_break_hours"
        ),
        Arel::Nodes::NamedFunction.new(
          'GREATEST',
          [
            Arel::Nodes::InfixOperation.new(
              :-,
              ArelHelpers.value_or_zero(
                rota_hours_acceptance_periods_with_durations[:duration]
              ),
              ArelHelpers.value_or_zero(
                rota_hours_acceptance_breaks_with_durations[:duration]
              ),
            ),
            0
          ],
          "payable_hours"
        ),
        Arel::Nodes::NamedFunction.new(
          'GREATEST',
          [
            Arel::Nodes::InfixOperation.new(
              :-,
              ArelHelpers.value_or_zero(
                week_hours_acceptance_periods_with_durations[:duration]
              ),
              ArelHelpers.value_or_zero(
                week_hours_acceptance_breaks_with_durations[:duration]
              )
            ),
            0
          ],
          "week_payable_hours"
        )
      ).
      distinct

    staff_members_with_hours = staff_members_with_hours_query.as("staff_members_with_hours")

    staff_members_with_costs = staff_members.
      join(staff_members_with_hours).
      on(
        staff_members[:id].eq(staff_members_with_hours[:id])
      ).
      project(
        staff_members[Arel.star],
        staff_members_with_hours[:hours_rotaed].as("hours_rotaed"),
        staff_members_with_hours[:hours_worked].as("hours_worked"),
        staff_members_with_hours[:break_hours].as("break_hours"),
        ArelHelpers.staff_member_total_calculation(
          calculation_type_column: staff_members_with_hours[:calculation_type],
          pay_rate_column: staff_members_with_hours[:pay_rate_in_pounds],
          hours_rotaed_column: staff_members_with_hours[:hours_rotaed],
          hours_in_week_column: staff_members_with_hours[:week_hours_rotaed]
        ).as('rotaed_cost'),
        ArelHelpers.staff_member_total_calculation(
          calculation_type_column: staff_members_with_hours[:calculation_type],
          pay_rate_column: staff_members_with_hours[:pay_rate_in_pounds],
          hours_rotaed_column: staff_members_with_hours[:payable_hours],
          hours_in_week_column: staff_members_with_hours[:week_payable_hours]
        ).as('actual_cost'),
      )

    sql = staff_members_with_costs.to_sql
    StaffMember.find_by_sql(sql)
  end
end
