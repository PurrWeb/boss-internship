class TimeDodgersService
  def initialize(week: RotaWeek.new(Time.current.to_date), dodgers_limit: 47)
    @week = week
    @dodgers_limit = dodgers_limit * 60
  end

  attr_reader :week, :dodgers_limit

  def dodgers_data
    staff_members_ids = accepted_minutes.keys | paid_holiday_days.keys | accepted_breaks_minutes.keys | owed_hours_minutes.keys

    staff_members_ids.inject({ accepted_hours: {}, accepted_breaks: {}, paid_holidays: {}, owed_hours: {} }) do |acc, staff_member_id|
      staff_member_accepted_breaks_minutes = accepted_breaks_minutes[staff_member_id].to_i
      staff_member_accepted_minutes = accepted_minutes[staff_member_id].to_i - staff_member_accepted_breaks_minutes
      staff_member_paid_holidays_minutes = paid_holiday_days[staff_member_id].to_i * 576
      staff_member_owed_hours_minutes = owed_hours_minutes[staff_member_id].to_i
      dodged_time = staff_member_accepted_minutes + staff_member_paid_holidays_minutes + staff_member_owed_hours_minutes

      if dodged_time > dodgers_limit || dodged_time == 0
        acc
      else
        acc[:accepted_hours][staff_member_id] = staff_member_accepted_minutes
        acc[:accepted_breaks][staff_member_id] = staff_member_accepted_breaks_minutes
        acc[:paid_holidays][staff_member_id] = staff_member_paid_holidays_minutes
        acc[:owed_hours][staff_member_id] = staff_member_owed_hours_minutes
        acc
      end
    end
  end

  def staff_members
    accepted_hours = dodgers_data.fetch(:accepted_hours)
    paid_holidays = dodgers_data.fetch(:paid_holidays)
    accepted_breaks = dodgers_data.fetch(:accepted_breaks)
    owed_hours = dodgers_data.fetch(:owed_hours)

    StaffMember.
      enabled.
      on_weekly_pay_rate.
      where(id: (accepted_hours.keys | paid_holidays.keys | accepted_breaks.keys | owed_hours.keys)).
      includes([:email_address, :name, :staff_type])
  end

  private
  def accepted_minutes
    @accepted_minutes ||= StaffMembersAcceptedHoursByWeekQuery.new(week: week).all
  end

  def accepted_breaks_minutes
    @accepted_breaks_minutes ||= StaffMembersAcceptedBreaksByWeekQuery.new(week: week).all
  end

  def paid_holiday_days
    @paid_holiday_days ||= StaffMembersPaidHolidaysByWeekQuery.new(week: week).all
  end

  def owed_hours_minutes
    @owed_hours_minutes ||= StaffMembersOwedHoursByWeekQuery.new(week: week).all
  end
end