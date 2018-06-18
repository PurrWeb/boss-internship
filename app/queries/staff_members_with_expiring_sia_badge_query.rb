class StaffMembersWithExpiringSiaBadgeQuery
  def initialize(expiring_before: Time.zone.now, relation: StaffMember.security)
    @expiring_before = expiring_before.to_date
    @relation = relation
  end

  def all
    relation.
      enabled.
      where(
        '`staff_members`.sia_badge_expiry_date < ?',
        expiring_before
      )
  end

  private
  attr_reader :expiring_before, :relation
end
