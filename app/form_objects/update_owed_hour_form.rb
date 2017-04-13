class UpdateOwedHourForm < OwedHourForm
  def path
    Rails.application.routes.url_helpers.owed_hour_path(id: model.id)
  end

  validate :date_valid_for_update

  def date_valid_for_update
    return unless date.present? && changed?(:date)

    if (date < RotaShiftDate.to_rota_date(Time.current))
      errors.add(:date, "can't be changed to date in the past")
    end
  end
end
