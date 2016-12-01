# Used to back OwedHourForm. Handles mapping of hours and minutes duration
# in UI to minutes field of the model
class OwedHourViewModel < Disposable::Twin
  feature Sync
  feature Changed

  property :week_start_date
  property :note
  property :hours, virtual: true
  property :minutes, virtual: false

  def initialize(model, params={})
    super(model, params)
    total_minutes = model.minutes || 0
    self.hours = HoursHelper.hours_from_total_minutes(total_minutes)
    self.minutes = HoursHelper.hour_minutes_from_total_minutes(total_minutes)
    @total_minutes = total_minutes
  end

  def id
    model.id
  end

  def model_editable?
    model.editable?
  end

  def hours=(val)
    super(Integer(val)) if val.present?
  end

  def minutes=(val)
    super(Integer(val)) if val.present?
  end

  def sync
    super
    model.minutes = HoursHelper.total_minutes_from_hours_and_minutes(
      hours: self.hours,
      minutes: self.minutes
    )
  end

  def save
    model.save
  end

  def to_key(*args)
    model.public_send(:to_key, *args)
  end
end
