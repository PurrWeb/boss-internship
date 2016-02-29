# Returns all staff members for that fall into the Kitchen category
class RotaForecastKitchenCategoryQuery
  def all
    StaffMember.joins(:staff_type).merge(StaffType.kitchen)
  end
end
