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
    :hoursPending,
    :netWagesCents,
    :canSeeNetWages,
    :staffMemberSageId,
    :staffMemberAllowNoSageId,
    :staffMemberDisabled,
    :containsTimeShiftedOwedHours,
    :containsTimeShiftedHolidays,
    :daysNeedingCompletion,
    :pendingCalculation,
    :completionDateReached

  def status
    object.current_state
  end

  def hoursPending
    status_data.fetch(:hours_pending)
  end

  def completionDateReached
    object.completion_date_reached?
  end

  def daysNeedingCompletion
    status_data.fetch(:days_needing_completion)
  end

  def staffMemberId
    object.staff_member_id
  end

  def staffMemberDisabled
    object.staff_member.disabled?
  end

  def staffMemberName
    object.staff_member_name
  end

  def mondayHoursCount
    if object.requiring_update?
      object.monday_hours_count || 0.0
    else
      object.monday_hours_count
    end
  end

  def tuesdayHoursCount
    if object.requiring_update?
      object.tuesday_hours_count || 0.0
    else
      object.tuesday_hours_count
    end
  end

  def wednesdayHoursCount
    if object.requiring_update?
      object.wednesday_hours_count || 0.0
    else
      object.wednesday_hours_count
    end
  end

  def thursdayHoursCount
    if object.requiring_update?
      object.thursday_hours_count || 0.0
    else
      object.thursday_hours_count
    end
  end

  def fridayHoursCount
    if object.requiring_update?
      object.friday_hours_count || 0.0
    else
      object.friday_hours_count
    end
  end

  def saturdayHoursCount
    if object.requiring_update?
      object.saturday_hours_count || 0.0
    else
      object.saturday_hours_count
    end
  end

  def sundayHoursCount
    if object.requiring_update?
      object.sunday_hours_count || 0.0
    else
      object.sunday_hours_count
    end
  end

  def holidayDaysCount
    if object.requiring_update?
      object.holiday_days_count || 0
    else
      object.holiday_days_count
    end
  end

  def owedHoursMinuteCount
    if object.requiring_update?
      object.owed_hours_minute_count || 0
    else
      object.owed_hours_minute_count
    end
  end

  def payRateDescription
    object.pay_rate_description
  end

  def accessoriesCents
    if object.requiring_update?
      object.accessories_cents || 0
    else
      object.accessories_cents
    end
  end

  def total
    if object.requiring_update?
      object.total || 0
    else
      object.total
    end
  end

  def totalHoursCount
    if object.requiring_update?
      object.total_hours_count || 0.0
    else
      object.total_hours_count
    end
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

  def staffMemberAllowNoSageId
    true
  end

  def containsTimeShiftedOwedHours
    object.contains_time_shifted_owed_hours?
  end

  def containsTimeShiftedHolidays
    object.contains_time_shifted_holidays?
  end

  def pendingCalculation
    object.requiring_update?
  end

  private
  def status_data
    @status_data ||= GetPendingHoursStatus.new(week: RotaWeek.new(object.week_start), staff_member: object.staff_member).status_data
  end
end
