class GenerateFinanceReportData
  def initialize(staff_member:, week:)
    @staff_member = staff_member
    @week = week
  end
  attr_reader :staff_member, :week

  def call
    staff_member_data = {}

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

    staff_member_data[:monday_hours_count] = monday_hours_count
    staff_member_data[:tuesday_hours_count] = tuesday_hours_count
    staff_member_data[:wednesday_hours_count] = wednesday_hours_count
    staff_member_data[:thursday_hours_count] = thursday_hours_count
    staff_member_data[:friday_hours_count] = friday_hours_count
    staff_member_data[:saturday_hours_count] = saturday_hours_count
    staff_member_data[:sunday_hours_count] = sunday_hours_count
    staff_member_data[:hours_count] = approved_hours_count

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

    holiday_day_count = holidays.inject(0) do |sum, holiday|
      sum + holiday.days
    end

    staff_member_data[:holiday_day_count] = holiday_day_count

    owed_hours = OwedHoursInWeekQuery.new(
      relation: OwedHour.enabled.where(staff_member: staff_member),
      week: week
    ).all

    owed_hours_minutes =  owed_hours.inject(0) do |sum, owed_hour|
      sum + owed_hour.minutes
    end
    owed_hours_count =  owed_hours_minutes / 60

    staff_member_data[:owed_hours_count] = owed_hours_count

    if staff_member.pay_rate.weekly?
      staff_member_data[:total] = staff_member.pay_rate.rate_in_pounds
    elsif staff_member.pay_rate.hourly?
      approved_hours_total = staff_member.pay_rate.rate_in_pounds * approved_hours_count
      owed_hours_total = staff_member.pay_rate.rate_in_pounds * owed_hours_count

      staff_member_data[:total] = approved_hours_total + owed_hours_total
    else
      raise "Unsupported pay rate calculation_type: #{staff_member.pay_rate.calculation_type}"
    end

    staff_member_data
  end
end
