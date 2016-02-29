# Returns all staff members for that fall into the Pr category
class RotaForecastPrsCategoryQuery
  def all
    StaffMember.joins(:staff_type).merge(StaffType.pr)
  end
end
