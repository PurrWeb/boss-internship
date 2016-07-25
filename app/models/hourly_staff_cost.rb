class HourlyStaffCost
  def initialize(staff_members_arel_query:, rota:)
    @staff_members_arel_query = staff_members_arel_query
    @rota = rota
  end


  # Returns value representing total cost for staff members
  # in supplied table, taking into account payment type and payrates
  def total_cents
    rota_shifts = Arel::Table.new(:rota_shifts)
    rotas = Arel::Table.new(:rotas)
    pay_rates = Arel::Table.new(:pay_rates)
    filtered_staff_members = staff_members_arel_query.as('filtered_staff_members')

    query = rota_shifts.
      join(rotas).
      on(
        rotas[:id].eq(rota_shifts[:rota_id]).
        and(
          rotas[:date].eq(rota.date)
        )
      ).
      where(rota_shifts[:enabled].eq(true)).
      where(rota_shifts[:ends_at].not_eq(nil)).
      where(rota_shifts[:starts_at].not_eq(nil))

    shifts_with_totals_query = query.
      project(
        rota_shifts[:id],
        rota_shifts[:staff_member_id],
        ArelHelpers.duration_in_hours_column(
          start_column: rota_shifts[:starts_at],
          end_column: rota_shifts[:ends_at]
        ).as('rotaed_hours')
      )
    shifts_with_totals = shifts_with_totals_query.as("shifts_with_totals")

    staff_member_hours_query = Arel::SelectManager.new(ActiveRecord::Base).
      from(filtered_staff_members).
      join(shifts_with_totals).
      on(
        filtered_staff_members[:id].eq(shifts_with_totals[:staff_member_id])
      ).
      join(pay_rates).
      on(
       filtered_staff_members[:pay_rate_id].eq(pay_rates[:id])
      ).
      group(filtered_staff_members[:id]).
      project(
        filtered_staff_members[:id].as("staff_member_hours_id"),
        pay_rates[:calculation_type].as('calculation_type'),
        pay_rates[:cents].as('pay_rate_cents'),
        shifts_with_totals[:rotaed_hours].sum.as('rotaed_hours'),
      )
      staff_member_hours = staff_member_hours_query.as("staff_member_hours")

    staff_member_hours_with_totals_query = Arel::SelectManager.new(ActiveRecord::Base).
      from(staff_member_hours).
      project(
        staff_member_hours[:staff_member_hours_id].as("staff_member_hours_with_totals_id"),
        staff_member_hours[:calculation_type],
        staff_member_hours[:pay_rate_cents],
        staff_member_hours[:rotaed_hours],
        ArelHelpers.staff_member_hourly_total_cents_calculation(
          calculation_type_column: staff_member_hours[:calculation_type],
          hours_column: staff_member_hours[:rotaed_hours],
          pay_rate_cents_column: staff_member_hours[:pay_rate_cents]
        ).as("total_cents")
      )
      staff_member_hours_with_totals = staff_member_hours_with_totals_query.as("staff_member_hours_with_totals")

    total = Arel::SelectManager.new(ActiveRecord::Base).
      from(staff_member_hours_with_totals).
      project(
        staff_member_hours_with_totals[:total_cents].sum
      )

    ActiveRecord::Base.connection.execute(total.to_sql).first.first.to_f
  end

  def self.required_columns(table)
    [
      table[:id],
      table[:pay_rate_id]
    ]
  end

  private
  attr_reader :staff_members_arel_query, :rota
end
