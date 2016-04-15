class UpcomingPublishedShiftQuery
  def initialize(staff_member:, now: Time.zone.now)
    @staff_member = staff_member
    @now = now
  end

  def all
    relation = RotaShift.
      enabled.
      where(staff_member: staff_member).
      joins(:rota).
      merge(
        Rota.in_state(:published)
      )

    UpcomingQuery.new(relation: relation).all
  end

  private
  attr_reader :staff_member, :now
end
