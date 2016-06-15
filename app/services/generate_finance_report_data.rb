class GenerateFinanceReportData
  def initialize(staff_member:, week:)
    @staff_member = staff_member
    @week = week
  end
  attr_reader :staff_member, :week

  def call
    report_data = FinanceReport.new(
      staff_member: staff_member,
      staff_member_name: staff_member.full_name,
      week_start: week.start_date,
      pay_rate_description: staff_member.pay_rate.text_description
    )

    staff_member_clock_in_days = ClockInDay.
      where(staff_member: staff_member)

    clock_in_days = InRangeQuery.new(
      relation: staff_member_clock_in_days,
      start_value: week.start_date,
      end_value: week.end_date,
      start_column_name: 'date',
      end_column_name: 'date'
    ).all

    hours_acceptance_periods = HoursAcceptancePeriod.
      accepted.
      joins(:clock_in_day).
      merge(clock_in_days)

    monday_hours_count = 0
    tuesday_hours_count = 0
    wednesday_hours_count = 0
    thursday_hours_count = 0
    friday_hours_count = 0
    saturday_hours_count = 0
    sunday_hours_count = 0

    hours_acceptance_periods.each do |hours_acceptance_period|
      hours_count = hours_acceptance_period.payable_hours

      case hours_acceptance_period.clock_in_day.date.strftime('%A')
      when 'Monday'
        monday_hours_count = monday_hours_count + hours_count
      when 'Tuesday'
        tuesday_hours_count = tuesday_hours_count + hours_count
      when 'Wednesday'
        wednesday_hours_count = wednesday_hours_count + hours_count
      when 'Thursday'
        thursday_hours_count = thursday_hours_count + hours_count
      when 'Friday'
        friday_hours_count = friday_hours_count + hours_count
      when 'Saturday'
        saturday_hours_count = saturday_hours_count + hours_count
      when 'Sunday'
        sunday_hours_count = sunday_hours_count + hours_count
      else
        raise "unsupported day encountered: #{ hours_acceptance_period.clock_in_day.date.strftime('%A') }"
      end
    end

    approved_hours_count = monday_hours_count +
      tuesday_hours_count +
      wednesday_hours_count +
      thursday_hours_count +
      friday_hours_count +
      saturday_hours_count +
      sunday_hours_count

    report_data.monday_hours_count = monday_hours_count
    report_data.tuesday_hours_count = tuesday_hours_count
    report_data.wednesday_hours_count = wednesday_hours_count
    report_data.thursday_hours_count = thursday_hours_count
    report_data.friday_hours_count = friday_hours_count
    report_data.saturday_hours_count = saturday_hours_count
    report_data.sunday_hours_count = sunday_hours_count
    report_data.total_hours_count = approved_hours_count

    staff_member_holidays = Holiday.
      paid.
      in_state(:enabled).
      where(staff_member: staff_member)

    holidays = InRangeQuery.new(
      relation: staff_member_holidays,
      start_value: week.start_date,
      end_value: week.end_date,
      start_column_name: 'start_date',
      end_column_name: 'end_date'
    ).all

    holiday_days_count = holidays.inject(0) do |sum, holiday|
      sum + holiday.days
    end

    report_data.holiday_days_count = holiday_days_count

    owed_hours = OwedHoursInWeekQuery.new(
      relation: OwedHour.enabled.where(staff_member: staff_member),
      week: week
    ).all

    owed_hours_minute_count = owed_hours.inject(0) do |sum, owed_hour|
      sum + owed_hour.minutes
    end

    owed_hours_count = owed_hours_minute_count / 60.0

    report_data.owed_hours_minute_count = owed_hours_minute_count

    if staff_member.pay_rate.weekly?
      report_data.total_cents = staff_member.pay_rate.cents
    elsif staff_member.pay_rate.hourly?
      approved_hours_total_cents = staff_member.pay_rate.cents * approved_hours_count
      owed_hours_total_cents = staff_member.pay_rate.cents * owed_hours_count

      report_data.total_cents = approved_hours_total_cents + owed_hours_total_cents
    else
      raise "Unsupported pay rate calculation_type: #{staff_member.pay_rate.calculation_type}"
    end

    report_data
  end
end
