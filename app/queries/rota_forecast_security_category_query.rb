# Returns all staff members for that fall into the Staff category
class RotaForecastSecurityCategoryQuery
  def all
    StaffMember.joins(:staff_type).merge(StaffType.security)
  end
end
