class StaffMembersWithoutPhotoQuery
  def all
    StaffMember.
      enabled.
      where(avatar: nil)
  end
end
