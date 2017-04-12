module OwedHourForm
  extend ActiveSupport::Concern

  included do
    property :date
    property :hours
    property :minutes
    property :note

    validates :date, presence: true
    validates :hours, numericality: {
      greater_than_or_equal_to: 0,
      less_than: 120
    }
    validates :minutes, numericality: {
      greater_than_or_equal_to: 0,
      less_than: 60
    }
    validates :note, presence: true
    validate :non_zero_time
    validate :owed_hour_editable

    def owed_hour_editable
      if !model.model_editable?
        errors.add(:base, "owed hour is not editable")
      end
    end

    def non_zero_time
      if hours == 0 && minutes == 0
        errors.add(:base, 'Owed hours must be non zero time')
      end
    end
  end
end
