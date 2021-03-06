# Returns all staff members rotead or with clocked in for a given day with totals for hours worked and hours rotaed
#
# End result is a collection of staff members with extra calculated fields which can be summed together to obtain the values required for the daily reports table (See DailyReportSummaryCalculator)
# Extra fields are 'hours_rotaed', 'hours_worked', 'break_hours', 'rotaed_cost_cents', 'actual_cost_cents', 'overhead_cost_cents'
class DailyReportsIndexStaffMemberQuery
  def initialize(date:, venue:)
    @date = date
    @venue = venue
  end
  attr_reader :date, :venue

  def all
    staff_members = Arel::Table.new(:staff_members)
    rota_shifts = Arel::Table.new(:rota_shifts)
    clock_in_days = Arel::Table.new(:clock_in_days)
    hours_acceptance_periods = Arel::Table.new(:hours_acceptance_periods)
    hours_acceptance_breaks = Arel::Table.new(:hours_acceptance_breaks)
    pay_rates = Arel::Table.new(:pay_rates)

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

    rota_hours_acceptance_periods_with_durations = rota_hours_acceptance_periods_with_durations_query.as("rota_hours_acceptance_periods_with_durations")
    rota_hours_acceptance_breaks_with_durations = rota_hours_acceptance_breaks_with_durations_query.as("rota_hours_acceptance_breaks_with_durations")
    rota_shifts_with_durations = rota_shifts_with_durations_query.as("rota_shifts_with_durations")

    staff_members_query = staff_members.
      join(rota_shifts_with_durations, Arel::Nodes::OuterJoin).
      on(
        rota_shifts_with_durations[:staff_member_id].eq(staff_members[:id])
      ).
      join(rota_hours_acceptance_periods_with_durations, Arel::Nodes::OuterJoin).
      on(
        rota_hours_acceptance_periods_with_durations[:staff_member_id].eq(staff_members[:id])
      ).
      join(rota_hours_acceptance_breaks_with_durations, Arel::Nodes::OuterJoin).
      on(
        rota_hours_acceptance_breaks_with_durations[:staff_member_id].eq(staff_members[:id])
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
        (pay_rates[:cents]).as('pay_rate_cents'),
        ArelHelpers.value_or_zero(
          rota_shifts_with_durations[:duration],
          as: "hours_rotaed"
        ),
        ArelHelpers.value_or_zero(
          rota_hours_acceptance_periods_with_durations[:duration],
          as: "hours_worked",
        ),
        ArelHelpers.value_or_zero(
          rota_hours_acceptance_breaks_with_durations[:duration],
          as: "break_hours"
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
        ArelHelpers.staff_member_hourly_total_cents_calculation(
          calculation_type_column: staff_members_with_hours[:calculation_type],
          pay_rate_cents_column: staff_members_with_hours[:pay_rate_cents],
          hours_column: staff_members_with_hours[:hours_rotaed]
        ).as('rotaed_cost_cents'),
        ArelHelpers.staff_member_hourly_total_cents_calculation(
          calculation_type_column: staff_members_with_hours[:calculation_type],
          pay_rate_cents_column: staff_members_with_hours[:pay_rate_cents],
          hours_column: staff_members_with_hours[:payable_hours]
        ).as('actual_cost_cents'),
        ArelHelpers.staff_members_daily_overhead_cents_calculation(
          calculation_type_column: staff_members_with_hours[:calculation_type],
          pay_rate_cents_column: staff_members_with_hours[:pay_rate_cents]
        ).as('overhead_cost_cents')
      )

    sql = staff_members_with_costs.to_sql
    StaffMember.find_by_sql(sql)
  end
end
