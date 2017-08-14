class HolidaySerializer < ActiveModel::Serializer
  attributes :id, :holiday_type, :start_date, :end_date, :creator, :note, :created_at

  def creator
    object.creator.full_name
  end
end
