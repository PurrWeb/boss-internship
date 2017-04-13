class CreateOwedHourForm < OwedHourForm
  validate :date_valid_for_creation

  def date_valid_for_creation
    if date.present? && (date < RotaShiftDate.to_rota_date(Time.current))
      errors.add(:base, "can't create owed hours in the past")
    end
  end
end
