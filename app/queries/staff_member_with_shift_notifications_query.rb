class StaffMemberWithShiftNotificationsQuery
  def initialize(now: Time.zone.now)
    @now = now
  end

  def all
    StaffMember.
      enabled.
      where('shift_change_occured_at < ?', now - 30.minutes)
  end

  private
  attr_reader :now
end
