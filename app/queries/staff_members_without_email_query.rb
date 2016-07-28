class StaffMembersWithoutEmailQuery
  def all
    StaffMember.
      enabled.
      where(email_address_id: nil)
  end
end
