# Returns all staff members for that fall into the Staff category
class RotaForecastStaffCategoryQuery
  def all
    StaffMember.
      joins(:staff_type).
      merge(
        StaffType.
          not_pr.
          not_kitchen.
          not_security
      )
  end
end
