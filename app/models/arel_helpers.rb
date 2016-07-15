class ArelHelpers
  def self.duration_in_hours_column(start_column:, end_column:)
    Arel.sql("TIMESTAMPDIFF(MINUTE, #{get_column_name(start_column)}, #{get_column_name(end_column)}) / 60.0")
  end

  def self.get_column_name(column)
    "`#{column.relation.name}`.`#{column.name}`"
  end

  # Returns Arel SQL literal for selecting the total cost for a staff member taking into account
  # the payment type and payrate
  def self.staff_member_total_calculation(calculation_type_column:, hours_rotaed_column:, hours_in_week_column:, pay_rate_column:)
    hourly_calculation = "#{get_column_name(hours_rotaed_column)} * #{get_column_name(pay_rate_column)}"

    fraction_of_weekly_hours_ratio = "(#{get_column_name(hours_rotaed_column)} / #{get_column_name(hours_in_week_column)})"
    weekly_sub_calculation = "#{get_column_name(pay_rate_column)} * #{fraction_of_weekly_hours_ratio}"
    weekly_calculation = "IF(#{get_column_name(hours_in_week_column)} = 0, 0, #{weekly_sub_calculation})"

    statement = ["CASE WHEN #{get_column_name(calculation_type_column)} = '#{PayRate::HOURLY_CALCULATION_TYPE}' THEN #{hourly_calculation} "]
    statement << "WHEN #{get_column_name(calculation_type_column)} = '#{PayRate::WEEKLY_CALCULATION_TYPE}' THEN #{weekly_calculation} "
    statement << "END"
    Arel.sql(statement.join(''))
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
