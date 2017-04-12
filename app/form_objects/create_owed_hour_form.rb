class CreateOwedHourForm < Form
  include OwedHourForm

  validate :date_valid_for_creation

  def date_valid_for_creation
    if date.present? && (date < RoteShiftDate.to_rota_date(Time.current))
      errors.add(:base, "can't create owed hours in the past")
    end
  end
end
