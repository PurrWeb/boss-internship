class Api::V1::StaffMemberProfile::HolidayRequestSerializer < ActiveModel::Serializer
  attributes \
    :id,
    :start_date,
    :end_date,
    :state,
    :created_at,
    :holiday_type,
    :creator,
    :note,
    :editable

  def start_date
    UIRotaDate.format(object.start_date)
  end

  def end_date
    UIRotaDate.format(object.end_date)
  end

  def state
    object.current_state
  end

  def editable
    object.pending? && user_can_edit
  end

  def creator
    object.creator.full_name
  end

  private

  def user_can_edit
    current_user = instance_options[:scope]
    object.creator.id == current_user.id || current_user.admin?
  end
end
