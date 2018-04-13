class HolidaySerializer < ActiveModel::Serializer
  attributes \
    :id,
    :holiday_type,
    :start_date,
    :end_date,
    :creator,
    :note,
    :created_at,
    :editable

  def start_date
    UIRotaDate.format(object.start_date)
  end

  def end_date
    UIRotaDate.format(object.end_date)
  end

  def creator
    object.creator.full_name
  end

  def editable
    object.editable? && user_can_edit
  end

  def user_can_edit
    current_user = instance_options[:scope]
    object.creator.id == current_user.id || current_user.admin?
  end
end
