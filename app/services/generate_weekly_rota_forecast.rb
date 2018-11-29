# Generates composite rota forecast and then recalculates the overheads
# to avoid rounding errors
class GenerateWeeklyRotaForecast
  def initialize(rota_forecasts:, week:)
    @rota_forecasts = rota_forecasts
    @week = week
  end
  attr_reader :rota_forecasts, :week

  def call
    #Ensure all forcasts supplied are in the correct week
    if rota_forecasts.any? { |rota_forecast| week != RotaWeek.new(rota_forecast.date) }
      raise 'All supplied forcasts must be in the same week'
    end
    venue = rota_forecasts.first.rota.venue
    if rota_forecasts.any? { |rota_forecast| venue.id != rota_forecast.rota.venue.id }
      raise 'All supplied forecasts must be for the same venue'
    end

    composite_rota_forecast = GenerateCompositeRotaForecast.new(
      rota_forecasts: rota_forecasts,
    ).call

    new_overhead_total_cents = exact_weekly_overhead_value(
      week: week,
      venue: venue
    )

    CompositeRotaForecast.new(
      week_start: week.start_date,
      venue: venue,
      forecasted_take_cents: composite_rota_forecast.forecasted_take_cents,
      total_cents: composite_rota_forecast.total_cents,
      staff_total_cents: composite_rota_forecast.staff_total_cents,
      pr_total_cents: composite_rota_forecast.pr_total_cents,
      kitchen_total_cents: composite_rota_forecast.kitchen_total_cents,
      security_total_cents: composite_rota_forecast.security_total_cents,
      overhead_total_cents: new_overhead_total_cents
    )
  end

  private
  def exact_weekly_overhead_value(week:, venue:)
    staff_members = Arel::Table.new(:staff_members)
    staff_member_transitions = Arel::Table.new(:staff_member_transitions)
    pay_rates = Arel::Table.new(:pay_rates)

    query = staff_members.
      join(staff_member_transitions, Arel::Nodes::OuterJoin).
      on(
        staff_members[:id].eq(
          staff_member_transitions[:staff_member_id]
        ).
        and(
          staff_member_transitions[:most_recent].eq(1)
        )
      ).
      join(pay_rates).
      on(
        pay_rates[:id].eq(staff_members[:pay_rate_id])
      ).
      where(
        staff_members[:master_venue_id].eq(venue.id).
        and(
          staff_members[:created_at].lt(RotaShiftDate.new(week.end_date).end_time)
        ).
        and(
          staff_member_transitions[:to_state].eq(nil).
          or(
            staff_member_transitions[:to_state].eq("enabled")
          )
        )
      ).
      where(
        pay_rates[:calculation_type].eq(PayRate::WEEKLY_CALCULATION_TYPE)
      ).
      project(
        pay_rates[:cents].sum
      )

    ActiveRecord::Base.connection.execute(query.to_sql).first.first.to_f
  end
end
