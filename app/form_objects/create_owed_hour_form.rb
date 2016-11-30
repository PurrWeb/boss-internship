class CreateOwedHourForm < Reform::Form
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
