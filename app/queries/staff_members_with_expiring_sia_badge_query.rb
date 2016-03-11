class StaffMembersWithExpiringSiaBadgeQuery
  def initialize(now: Time.now, relation: StaffMember.all)
    @now = now
    @relation = relation
  end

  def all
    relation.
    where(
      '`staff_members`.sia_badge_expiry_date < ?',
      now + 6.weeks
    ).
    where(notified_of_sia_expiry_at: nil)
  end

  private
  attr_reader :now, :relation
end
