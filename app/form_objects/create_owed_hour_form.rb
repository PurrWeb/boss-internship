class CreateOwedHourForm < OwedHourForm
  validate :date_valid_for_creation

  def date_valid_for_creation
    if date.present?
      current_rota_date = RotaShiftDate.to_rota_date(Time.current)
      if date > current_rota_date
        errors.add(:base, "can't create owed hours in the future")
      elsif date < (current_rota_date - 2.weeks)
        errors.add(:base, "new owed hours must be for shifts in the last 2 weeks")
      end
    end
  end
end
