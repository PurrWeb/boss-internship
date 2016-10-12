class PayRateStaffMembersIndexQuery
  def initialize(pay_rate:, venue:, staff_type:)
    @pay_rate = pay_rate
    @venue = venue
    @staff_type = staff_type
  end
  attr_reader :pay_rate, :venue, :staff_type

  def all
    scope = StaffMember.
      enabled.
      where(pay_rate: pay_rate).
      joins(:name).
      order('LOWER(CONCAT(`names`.first_name, `names`.surname))')

    if venue.present?
      scope = scope.where(master_venue: venue)
    end

    if staff_type.present?
      scope = scope.where(staff_type: staff_type)
    end

    scope
  end
end
