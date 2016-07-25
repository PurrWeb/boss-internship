class ArelHelpers
  def self.duration_in_hours_column(start_column:, end_column:)
    Arel.sql("TIMESTAMPDIFF(MINUTE, #{get_column_name(start_column)}, #{get_column_name(end_column)}) / 60.0")
  end

  def self.get_column_name(column)
    "`#{column.relation.name}`.`#{column.name}`"
  end

  # Calculates hourly cost of staff member factoring in pay rate ammount and type.
  # Staff members with weekly pay rates are assigned an hourly cost of 0
  def self.staff_member_hourly_total_cents_calculation(calculation_type_column:, hours_column:,  pay_rate_cents_column:)
    hourly_calculation = "#{get_column_name(hours_column)} * #{get_column_name(pay_rate_cents_column)}"

    statement = ["CASE WHEN #{get_column_name(calculation_type_column)} = '#{PayRate::HOURLY_CALCULATION_TYPE}' THEN #{hourly_calculation} "]
    statement << "WHEN #{get_column_name(calculation_type_column)} = '#{PayRate::WEEKLY_CALCULATION_TYPE}' THEN 0 "
    statement << "END"
    Arel.sql(statement.join(''))
  end

  # Daily cost of staff members who are treated as overheads (i.e. are paid weekly)
  # values is the persons weekly salary divided by 7.
  # Staff members with hourly pay rates are assigned an overhead cost of 0
  def self.staff_members_daily_overhead_cents_calculation(calculation_type_column:, pay_rate_cents_column:)
    calculation = "#{get_column_name(pay_rate_cents_column)} / 7.0"

    Arel::Nodes::NamedFunction.new(
      "IF",
      [
        calculation_type_column.eq(PayRate::WEEKLY_CALCULATION_TYPE),
        Arel.sql(calculation),
        0
      ]
    )
  end

  def self.value_or_zero(expression, as: nil)
    Arel::Nodes::NamedFunction.new(
      "IFNULL",
      [
        expression,
        0
      ],
     as,
    )
  end
end
