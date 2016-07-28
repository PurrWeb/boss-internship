class StaffMembersWithoutAddressQuery
  def all
    StaffMember.
      enabled.
      where(address_id: nil)
  end
end
