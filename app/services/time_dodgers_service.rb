class TimeDodgersService
  def initialize(week: RotaWeek.new(Time.current.to_date), dodgers_limit: 47)
    @week = week
    @dodgers_limit = dodgers_limit * 60
  end

  attr_reader :week, :dodgers_limit

  def dodgers_data
    staff_members_ids = accepted_minutes.keys | paid_holiday_days.keys

    staff_members_ids.inject([{}, {}]) do |acc, staff_member_id|
      staff_member_accepted_minutes = accepted_minutes[staff_member_id].to_i
      staff_member_paid_holidays_minutes = paid_holiday_days[staff_member_id].to_i * 576

      if (staff_member_accepted_minutes + staff_member_paid_holidays_minutes) > dodgers_limit
        acc
      else
        acc[0][staff_member_id] = staff_member_accepted_minutes
        acc[1][staff_member_id] = staff_member_paid_holidays_minutes
        acc
      end
    end
  end

  def staff_members
    dodgers_accepted_hours, dodgers_paid_holidays = dodgers_data
    StaffMember.where(id: (dodgers_accepted_hours.keys | dodgers_paid_holidays.keys))
  end

  private
  def accepted_minutes
    @accepted_minutes ||= StaffMembersAcceptedHoursByWeekQuery.new(week: week).all
  end

  def paid_holiday_days
    @paid_holiday_days ||= StaffMembersPaidHolidaysByWeekQuery.new(week: week).all
  end
end