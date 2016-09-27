class DeleteStaffMember
  def initialize(
    requester:,
    staff_member:,
    would_rehire:,
    disable_reason: nil,
    nested: false,
    now: Time.zone.now
  )
    @requester = requester
    @staff_member = staff_member
    @now = now
    @would_rehire = would_rehire
    @disable_reason = disable_reason
    @nested = nested
  end

  def call
    ActiveRecord::Base.transaction(requires_new: nested) do
      disable_upcoming_shifts
      disable_upcoming_holidays
      disable_staff_member
      StaffTrackingEvent.create!(
        at: now,
        staff_member: staff_member,
        event_type: StaffTrackingEvent::DISABLE_EVENT_TYPE
      )
      StaffMemberUpdatesMailer.staff_member_disabled(staff_member).deliver_now
      update_related_daily_reports(staff_member)
    end
  end

  private
  attr_reader :staff_member, :requester, :would_rehire, :disable_reason, :now, :nested

  def disable_staff_member
    staff_member.
      state_machine.
      transition_to!(
        :disabled,
        requster_user_id: requester.id,
        disable_reason: disable_reason
      )

    staff_member.update_attributes!(would_rehire: would_rehire)
  end

  def disable_upcoming_shifts
    staff_member_shifts  = RotaShift.
      enabled.
      where(staff_member: staff_member)

    upcoming_staff_member_shifts = UpcomingQuery.new(
      relation: staff_member_shifts
    ).all

    upcoming_staff_member_shifts.each do |shift|
      DisableRotaShift.new(
        requester: requester,
        shift: shift,
        notify_staff_member: false
      ).call
    end
  end

  def disable_upcoming_holidays
    staff_member_holidays = Holiday.
      in_state(:enabled).
      where(staff_member: staff_member)

    upcoming_holidays = UpcomingQuery.new(
      now: now.to_date,
      start_column_name: 'start_date',
      relation: staff_member_holidays
    ).all

    upcoming_holidays.each do |holiday|
      DeleteHoliday.new(
        requester: requester,
        holiday: holiday
      ).call
    end
  end

  def update_related_daily_reports(staff_member)
    if staff_member.pay_rate.weekly?
      DailyReportDatesEffectedByStaffMemberOnWeeklyPayRateQuery.new(
        staff_member: staff_member
      ).to_a.each do |date, venue|
        DailyReport.mark_for_update!(venue: venue, date: date)
      end
    else
      DailyReportDatesEffectedByStaffMemberOnHourlyPayRateQuery.new(
        staff_member: staff_member
      ).to_a.each do |date, venue|
        DailyReport.mark_for_update!(venue: venue, date: date)
      end
    end
  end
end
