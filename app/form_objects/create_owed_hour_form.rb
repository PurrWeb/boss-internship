class CreateOwedHourForm < Form
  include OwedHourForm

  validate :date_valid_for_creation

  def date_valid_for_creation
    if week_start_date.present?
      week = RotaWeek.new(week_start_date)

      if week.week_status == :past
        errors.add(:base, "can't create owed hours in the past")
      end
    end
  end
end
