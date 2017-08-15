class HolidaySerializer < ActiveModel::Serializer
  attributes :id, :holiday_type, :start_date, :end_date, :creator, :note, :created_at

  def start_date
    UIRotaDate.format(object.start_date)
  end
  
  def end_date
    UIRotaDate.format(object.end_date)
  end
  
  def creator
    object.creator.full_name
  end

end
