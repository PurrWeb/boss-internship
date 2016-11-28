class CreateOwedHourForm < Reform::Form
  property :week_start_date
  property :hours
  property :minutes
  property :note

  validates :week_start_date, presence: true
  validates :hours, numericality: {
    greater_than_or_equal_to: 0,
    less_than: 120
  }
  validates :minutes, numericality: {
    greater_than_or_equal_to: 0,
    less_than: 60
  }
  validates :note, presence: true
  validate :date_is_week_start
  validate :non_zero_time

  def non_zero_time
    if hours == 0 && minutes == 0
      errors.add(:base, 'Owed hours must be non zero time')
    end
  end

  def date_is_week_start
    if week_start_date.present?
      week = RotaWeek.new(week_start_date)

      if week.start_date != week_start_date
        errors.add(:week_start_date, 'must be at start of week')
      end
    end

    if week.week_status == :past
      errors.add(:base, "can't create owed hours in the past")
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
