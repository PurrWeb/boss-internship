module OwedHourForm
  extend ActiveSupport::Concern

  included do
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

    def date_is_week_start
      if week_start_date.present?
        week = RotaWeek.new(week_start_date)

        if week.start_date != week_start_date
          errors.add(:week_start_date, 'must be at start of week')
        end
      end
    end
  end
end
