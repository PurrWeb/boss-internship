class Api::V1::StaffMemberProfile::HolidaySerializer < ActiveModel::Serializer
  attributes \
    :id,
    :holiday_type,
    :start_date,
    :end_date,
    :payslip_date,
    :creator,
    :note,
    :created_at,
    :editable,
    :state,
    :frozen,
    :requestedBy,
    :requestedAt

  def requestedBy
    object.holiday_request.creator.full_name if object.created_from_request?
  end

  def requestedAt
    object.holiday_request.created_at if object.created_from_request?
  end

  def start_date
    UIRotaDate.format(object.start_date)
  end

  def end_date
    UIRotaDate.format(object.end_date)
  end

  def payslip_date
    UIRotaDate.format(object.payslip_date)
  end

  def creator
    object.creator.full_name
  end

  def editable
    object.editable? && user_can_edit
  end

  def state
    object.created_from_request? ? 'accepted' : ''
  end

  def user_can_edit
    current_user = instance_options[:scope]
    object.creator.id == current_user.id || current_user.admin?
  end

  def frozen
    object.frozen?
  end
end
