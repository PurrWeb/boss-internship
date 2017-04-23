class GenerateYearlyReportData
  def initialize(staff_member:, tax_year:)
    @staff_member = staff_member
    @tax_year = tax_year
  end
  attr_reader :staff_member, :tax_year

  def call
    report = YearlyReport.new(staff_member: staff_member, tax_year: tax_year)

    clock_in_days = InRangeQuery.new(
      relation: ClockInDay.where(staff_member: staff_member),
      start_value: tax_year.start_date,
      end_value: tax_year.end_date,
      start_column_name: 'date',
      end_column_name: 'date'
    ).all

    hours_acceptance_periods = HoursAcceptancePeriod.
      accepted.
      where(clock_in_day: clock_in_days).
      includes([:clock_in_day, :hours_acceptance_breaks_enabled])

    staff_member_holidays = Holiday.
      paid.
      in_state(:enabled).
      where(staff_member: staff_member)

    holidays = InRangeQuery.new(
      relation: staff_member_holidays,
      start_value: tax_year.start_date,
      end_value: tax_year.end_date,
      start_column_name: 'start_date',
      end_column_name: 'end_date'
    ).all

    staff_member_owed_hours = OwedHour.enabled.where(staff_member: staff_member)

    owed_hours = InRangeQuery.new(
      relation: staff_member_owed_hours,
      start_value: RotaShiftDate.new(tax_year.start_date).start_time,
      end_value: RotaShiftDate.new(tax_year.end_date).end_time,
      start_column_name: 'created_at',
      end_column_name: 'created_at',
      include_boundaries: [:start]
    ).all

    hours_acceptance_periods.each do |hours_acceptance_period|
      week = RotaWeek.new(hours_acceptance_period.date)
      report.add_hours(
        rota_week: week,
        payable_hours: hours_acceptance_period.payable_hours
      )
    end

    owed_hours_count = (owed_hours.inject(0) do |sum, owed_hour|
      sum + owed_hour.minutes
    end) / 60.0
    report.owed_hours_count = owed_hours_count

    holiday_days_count = holidays.inject(0) do |sum, holiday|
      sum + holiday.days
    end
    report.holiday_days_count = holiday_days_count

    if staff_member.pay_rate.weekly?
      report.total_cents = staff_member.pay_rate.cents * 52
    elsif staff_member.pay_rate.hourly?
      approved_hours_total_cents = staff_member.pay_rate.cents * report.total_hours_count
      owed_hours_total_cents = staff_member.pay_rate.cents * owed_hours_count

      report.total_cents = approved_hours_total_cents + owed_hours_total_cents
    else
      raise "Unsupported pay rate calculation_type: #{staff_member.pay_rate.calculation_type}"
    end

    report
  end
end
