class UpdateOwedHourForm < OwedHourForm
  def path
    Rails.application.routes.url_helpers.owed_hour_path(id: model.id)
  end

  validate :date_valid_for_update

  def initialize(model, params={})
    @orignial_date = model.date
    super(model, params)
  end

  def date_valid_for_update
    return unless date_changed?

    current_rota_date = RotaShiftDate.to_rota_date(Time.current)
    if (date > RotaShiftDate.to_rota_date(Time.current))
      current_rota_date = RotaShiftDate.to_rota_date(Time.current)
      errors.add(:base, "can't move owed hour to be in the future") if date > current_rota_date
    elsif date < (current_rota_date - 2.weeks)
      errors.add(:base, "can't edit owed hours to be more than 2 weeks in the past")
    end
  end

  # We can't use normal dirty tracking because owed hours records are immutable
  def date_changed?
    date != @orignial_date
  end
end
