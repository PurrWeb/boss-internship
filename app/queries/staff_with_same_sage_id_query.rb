class StaffWithSameSageIdQuery
  Result = Struct.new(:same_sage_id, :all_staff_members)

  def all
    staff_members = StaffMember
      .where.not(sage_id: nil)
      .where.not(master_venue_id: nil)

    same_sage_id = []
    all_staff_members_ids = []

    staff_members.group_by { |s| [s.sage_id] }.each_pair do |sage, staff_members|
      sage_id = sage
      if staff_members.count > 1
        staff_members_ids = staff_members.map(&:id)
        same_sage_id << {
          sageId: sage_id[0],
          staffMembersIds: staff_members_ids,
        }
        all_staff_members_ids.concat(staff_members_ids)
      end
    end

    Result.new(same_sage_id, StaffMember.where(id: all_staff_members_ids))
  end
end
