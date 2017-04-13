# Used to back OwedHourForm. Handles mapping of hours and minutes duration
# in UI to minutes field of the model
class OwedHourViewModel < Disposable::Twin
  feature Sync
  feature Changed

  property :date
  property :note
  property :starts_at_offset, virtual: true
  property :ends_at_offset, virtual: true

  def initialize(model, params={})
    super(model, params)
    rota_shift_date = RotaShiftDate.new(model.date || RotaShiftDate.to_rota_date(Time.current))
    if model.starts_at.present?
      self.starts_at_offset = ((model.starts_at - rota_shift_date.start_time) / 60).floor
    end
    if model.ends_at.present?
      self.ends_at_offset = ((model.ends_at - rota_shift_date.start_time) / 60).floor
    end
  end

  def id
    model.id
  end

  def model_editable?
    model.editable?
  end

  def sync
    super
    starts_at = OwedHourForm.real_date_from_form_values(
      date: date,
      minute_offset: Integer(starts_at_offset)
    )
    ends_at = OwedHourForm.real_date_from_form_values(
      date: date,
      minute_offset: Integer(ends_at_offset)
    )

    model.starts_at = starts_at
    model.ends_at = ends_at
    if starts_at.present? && ends_at.present?
      model.minutes = (ends_at - starts_at) / 60
    end
  end

  def save
    model.save
  end

  def to_key(*args)
    model.public_send(:to_key, *args)
  end
end
