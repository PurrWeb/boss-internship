class Api::V1::FinanceReports::FinanceReportSerializer < ActiveModel::Serializer
  attributes \
    :id,
    :staffMemberId,
    :staffMemberName,
    :mondayHoursCount,
    :tuesdayHoursCount,
    :wednesdayHoursCount,
    :thursdayHoursCount,
    :fridayHoursCount,
    :saturdayHoursCount,
    :sundayHoursCount,
    :holidayDaysCount,
    :owedHoursMinuteCount,
    :payRateDescription,
    :accessoriesCents,
    :total,
    :totalHoursCount,
    :status,
    :netWagesCents,
    :canSeeNetWages,
    :staffMemberSageId

  def status
    FinanceReportService.new(finance_report: object).status_data
  end

  def staffMemberId
    object.staff_member_id
  end

  def staffMemberName
    object.staff_member_name
  end

  def mondayHoursCount
    object.monday_hours_count
  end

  def tuesdayHoursCount
    object.tuesday_hours_count
  end

  def wednesdayHoursCount
    object.wednesday_hours_count
  end

  def thursdayHoursCount
    object.thursday_hours_count
  end

  def fridayHoursCount
    object.friday_hours_count
  end

  def saturdayHoursCount
    object.saturday_hours_count
  end

  def sundayHoursCount
    object.sunday_hours_count
  end

  def holidayDaysCount
    object.holiday_days_count
  end

  def owedHoursMinuteCount
    object.owed_hours_minute_count
  end

  def payRateDescription
    object.pay_rate_description
  end

  def accessoriesCents
    object.accessories_cents
  end

  def total
    object.total
  end

  def totalHoursCount
    object.total_hours_count
  end

  def canSeeNetWages
    ability = scope.fetch(:ability)
    ability.can?(:see_net_wages, StaffMember.find(object.staff_member_id))
  end

  def netWagesCents
    object.net_wages_cents if (canSeeNetWages && object.wage_payments.count > 0)
  end

  def staffMemberSageId
    object.staff_member.sage_id
  end
end
