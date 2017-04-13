class OwedHourForm < Form
  property :date
  property :starts_at_offset
  property :ends_at_offset
  property :note

  validates :date, presence: true
  validates :starts_at_offset, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates :ends_at_offset, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates :note, presence: true
  validate :time_order
  validate :owed_hour_editable

  def possible_time_values
    result = []
    rota_shift_date = RotaShiftDate.new(date || Time.current)

    time = rota_shift_date.start_time
    minute_offset = 0
    while rota_shift_date.contains_time?(time_value_for(minute_offset))
      time_string = time_value_string_for(minute_offset)
      result << [time_string, minute_offset]

      minute_offset = minute_offset + time_resolution_minutes
      time = time + minute_offset.minutes
    end
    result
  end

  def sync
    super

  end

  #validation
  def owed_hour_editable
    if !model.model_editable?
      errors.add(:base, "owed hour is not editable")
    end
  end

  #validation
  def time_order
    if starts_at_offset.present? && ends_at_offset.present? && !(ends_at_offset > starts_at_offset)
      errors.add(:ends_at_offset, 'must be after starts_at')
    end
  end

  def time_resolution_minutes
    15
  end

  def time_value_for(minute_offset)
    rota_shift_date = RotaShiftDate.new(date || RotaShiftDate.to_rota_date(Time.current))
    rota_shift_date.start_time + minute_offset.minutes
  end

  def time_value_string_for(minute_offset)
    time_value_for(minute_offset).strftime('%H:%M')
  end

  def self.real_date_from_form_values(date:, minute_offset:)
    RotaShiftDate.new(date).start_time + minute_offset.minutes
  end
end
