class UpcomingPublishedShiftQuery
  def initialize(staff_member:, now: Time.now)
    @staff_member = staff_member
    @now = now
  end

  def all
    RotaShift.
      enabled.
      where('starts_at > ?', now).
      where(staff_member: staff_member).
      joins(:rota).
      merge(Rota.in_state(:published))
  end

  private
  attr_reader :staff_member, :now
end
