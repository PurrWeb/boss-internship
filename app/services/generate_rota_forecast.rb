class GenerateRotaForecast
  def initialize(forecasted_take_cents:, rota:)
    @forecasted_take_cents = forecasted_take_cents
    @rota = rota
  end

  def call
    RotaForecast.new(
      rota: rota,
      forecasted_take_cents: forecasted_take_cents,
      overhead_total_cents: overhead_total_cents,
      total_cents: total_cents,
      staff_total_cents: staff_total_cents,
      pr_total_cents: pr_total_cents,
      kitchen_total_cents: kitchen_total_cents,
      security_total_cents: security_total_cents
    )
  end

  private
  def total_cents
    staff_total_cents +
      pr_total_cents +
      kitchen_total_cents +
      security_total_cents +
      overhead_total_cents +
      tax_and_ni
  end

  def tax_and_ni
    (overhead_total_cents + kitchen_total_cents + staff_total_cents) * 0.08
  end

  def staff_total_cents
    staff_types = Arel::Table.new(:staff_types)
    staff_members = Arel::Table.new(:staff_members)
    kitchen_type_conditions = StaffType::KITCHEN_TYPE_NAMES.map do |name|
      staff_types[:name].not_eq(name)
    end.inject(nil) do |result, condition|
      if result == nil
        condition
      else
        result.and(condition)
      end
    end

    staff_members_arel_query = staff_members.
      join(staff_types).
      on(
        staff_members[:staff_type_id].eq(staff_types[:id])
      ).
      where(
        staff_types[:name].not_eq(StaffType::PR_TYPE_NAME).
        and(
          kitchen_type_conditions
        ).and(
          staff_types[:role].not_eq(StaffType::SECURITY_ROLE)
        )
      ).
      project(
        *HourlyStaffCost.required_columns(staff_members)
      )

    HourlyStaffCost.new(
      staff_members_arel_query: staff_members_arel_query,
      rota: rota
    ).total_cents
  end

  def pr_total_cents
    staff_types = Arel::Table.new(:staff_types)
    staff_members = Arel::Table.new(:staff_members)

    staff_members_arel_query = staff_members.
      join(staff_types).
      on(
        staff_members[:staff_type_id].eq(staff_types[:id])
      ).
      where(staff_types[:name].eq(StaffType::PR_TYPE_NAME)).
      project(
        *HourlyStaffCost.required_columns(staff_members)
      )

    HourlyStaffCost.new(
      staff_members_arel_query: staff_members_arel_query,
      rota: rota
    ).total_cents
  end

  def kitchen_total_cents
    staff_types = Arel::Table.new(:staff_types)
    staff_members = Arel::Table.new(:staff_members)
    kitchen_type_conditions = StaffType::KITCHEN_TYPE_NAMES.map do |name|
      staff_types[:name].eq(name)
    end.inject(nil) do |result, condition|
      if result == nil
        condition
      else
        result.or(condition)
      end
    end

    staff_members_arel_query = staff_members.
      join(staff_types).
      on(
        staff_members[:staff_type_id].eq(staff_types[:id])
      ).
      where(
        kitchen_type_conditions
      ).
      project(
        *HourlyStaffCost.required_columns(staff_members)
      )

    HourlyStaffCost.new(
      staff_members_arel_query: staff_members_arel_query,
      rota: rota
    ).total_cents
  end

  def security_total_cents
    staff_types = Arel::Table.new(:staff_types)
    staff_members = Arel::Table.new(:staff_members)

    staff_members_arel_query = staff_members.
      join(staff_types).
      on(
        staff_members[:staff_type_id].eq(staff_types[:id])
      ).
      where(staff_types[:role].eq(StaffType::SECURITY_ROLE)).
      project(
        *HourlyStaffCost.required_columns(staff_members)
      )

    HourlyStaffCost.new(
      staff_members_arel_query: staff_members_arel_query,
      rota: rota
    ).total_cents
  end

  def overhead_total_cents
    OverheadStaffCost.new(
      venue: rota.venue,
      date: rota.date
    ).total_cents
  end

  private
  attr_reader :rota, :forecasted_take_cents
end
