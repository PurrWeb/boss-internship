class DashboardMessageForm < Reform::Form
  property :send_to_all
  property :venue_ids
  property :title
  property :message
  property :publish_date

  validates :publish_date, :message, :title, :send_to_all, presence: true
  validate :venue_ids


  def venue_ids
    if !model.send_to_all? && model.venue_ids.blank?
      errors.add(:venueIds, "cant be blank")
    end
  end

  def time_value_for(minute_offset)
    rota_shift_date = RotaShiftDate.new(date || RotaShiftDate.to_rota_date(Time.current))
    rota_shift_date.start_time + minute_offset.minutes
  end
end
