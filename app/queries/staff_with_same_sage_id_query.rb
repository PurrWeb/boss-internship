class StaffWithSameSageIdQuery
  def all
    staff_members = StaffMember
      .where.not(sage_id: nil)
      .where.not(master_venue_id: nil)

    all_staff_members = []

    staff_members.group_by { |s| [s.master_venue_id, s.sage_id] }.each_pair do |venue_sage_id, staff_members|
      if staff_members.count > 1
        all_staff_members.concat(staff_members)
      end
    end

    all_staff_members
  end
end
