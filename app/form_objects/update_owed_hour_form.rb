class UpdateOwedHourForm < OwedHourForm
  def path
    Rails.application.routes.url_helpers.owed_hour_path(id: model.id)
  end

  validate :date_valid_for_update

  def date_valid_for_update
    return unless date.present?

    if (date > RotaShiftDate.to_rota_date(Time.current))
      current_rota_date = RotaShiftDate.to_rota_date(Time.current)
      errors.add(:base, "can't move owed hour to be in the future") if date > current_rota_date
    end
  end
end
