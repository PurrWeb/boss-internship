class CreateOwedHourForm < OwedHourForm
  validate :date_valid_for_creation

  def date_valid_for_creation
    if date.present?
      week = RotaWeek.new(date)
      week_in_past = week.week_status == :past

      errors.add(:base, "can't create owed hours in the past") if week_in_past
    end
  end
end
