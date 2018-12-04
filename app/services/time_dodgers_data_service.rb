class TimeDodgersDataService
  def initialize(start_date:, end_date:, relation: StaffMember.all)
    @start_date = start_date
    @end_date = end_date
    @relation = relation
  end

  def call
    staff_members_ids = accepted_minutes.keys | paid_holiday_days.keys | accepted_breaks_minutes.keys | owed_hours_minutes.keys
    result = {}
    staff_members_ids.each do |staff_member_id|
      staff_member_accepted_breaks_minutes = accepted_breaks_minutes[staff_member_id].to_i
      staff_member_accepted_minutes = accepted_minutes[staff_member_id].to_i - staff_member_accepted_breaks_minutes
      staff_member_paid_holidays_minutes = paid_holiday_days[staff_member_id].to_i * 576
      staff_member_owed_hours_minutes = owed_hours_minutes[staff_member_id].to_i
      data = {}
      data[:accepted_hours] = staff_member_accepted_minutes
      data[:accepted_breaks] = staff_member_accepted_breaks_minutes
      data[:paid_holidays] = staff_member_paid_holidays_minutes
      data[:owed_hours] = staff_member_owed_hours_minutes

      if block_given?
        yield(staff_member_id, data)
      else
        result[staff_member_id] = data
      end
    end
    result
  end

  private

  attr_reader :start_date, :end_date, :relation

  def accepted_minutes
    @accepted_minutes ||= StaffMembersAcceptedHoursQuery.new(
      start_date: start_date,
      end_date: end_date,
      relation: relation,
    ).all
  end

  def accepted_breaks_minutes
    @accepted_breaks_minutes ||= StaffMembersAcceptedBreaksQuery.new(
      start_date: start_date,
      end_date: end_date,
      relation: relation,
    ).all
  end

  def paid_holiday_days
    @paid_holiday_days ||= StaffMembersPaidHolidaysQuery.new(
      start_date: start_date,
      end_date: end_date,
      relation: relation,
    ).all
  end

  def owed_hours_minutes
    @owed_hours_minutes ||= StaffMembersOwedHoursQuery.new(
      start_date: start_date,
      end_date: end_date,
      relation: relation,
    ).all
  end
end
