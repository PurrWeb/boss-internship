class SecurityManagerStaffMemberIndexQuery
  def all
    StaffMember.
      enabled.
      joins(:staff_type).
      merge(StaffType.security)
  end
end
