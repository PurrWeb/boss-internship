class UpdateOwedHourForm < Form
  include OwedHourForm

  def path
    Rails.application.routes.url_helpers.owed_hour_path(id: model.id)
  end

  validate :date_valid_for_update

  def date_valid_for_update
    return unless week_start_date.present? && changed?(:week_start_date)

    week = RotaWeek.new(week_start_date)
    if week.week_status == :past
      errors.add(:week_start_date, "can't be changed to date in the past")
    end
  end
end
