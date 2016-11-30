class EditOwedHourForm < Reform::Form
  include OwedHourForm

  def path
    Rails.application.routes.url_helpers.owed_hour_path(id: model.id)
  end

  validate :date_valid_for_editing

  def date_valid_for_editing
    return unless week_start_date.present? && changed?(:week_start_date)

    week = RotaWeek.new(week_start_date)
    if week.week_status == :past
      errors.add(:week_start_date, "can't be changed to date in the past")
    end
  end

  #TODO: Refom isn't calling sync on Disposable::Twin model by default
  def sync
    super
    if model.respond_to?(:sync)
      model.public_send(:sync)
    end
  end

  def to_key(*args)
    model.public_send(:to_key, *args)
  end

  # Needed to back bootstrap form
  def self.validators_on(args)
    []
  end

  def persisted?
    false
  end
end
