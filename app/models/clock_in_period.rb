class ClockInPeriod < ActiveRecord::Base
  belongs_to :clock_in_day
  belongs_to :clock_in_period_reason
  belongs_to :creator, polymorphic: true
  has_many :clock_in_period_events
  has_many :clocking_events, through: :clock_in_period_events
  has_many :clock_in_breaks

  validates :clock_in_day, presence: true
  validates :creator, presence: true
  validates :starts_at, presence: true

  validate :times_in_correct_order
  validate :times_within_correct_day
  validate do |period|
    PeriodTimeOverlapValidator.new(period).validate
  end

  delegate :venue, :date, to: :clock_in_day

  def self.incomplete
    where(ends_at: nil)
  end

  def staff_member
    clock_in_day.andand.staff_member
  end

  # validation
  def times_in_correct_order
    if starts_at.present? && ends_at.present?
      errors.add(:base, 'starts_at must be after ends_at') if starts_at >= ends_at
    end
  end

  #validation
  def times_within_correct_day
    if clock_in_day.present?
      if starts_at.present? && (starts_at < RotaShiftDate.new(clock_in_day.date).start_time)
        raise "starts_at time #{starts_at} suppiled too early for #{clock_in_day.date}"
      end

      if ends_at.present? && (ends_at < RotaShiftDate.new(clock_in_day.date).start_time)
        raise "ends_at time #{ends_at} suppiled too early for #{clock_in_day.date}"
      end

      if starts_at.present? && (starts_at > RotaShiftDate.new(clock_in_day.date).end_time)
        raise "starts_at time #{starts_at} suppiled too late for #{clock_in_day.date}"
      end

      if ends_at.present? && (ends_at > RotaShiftDate.new(clock_in_day.date).end_time)
        raise "ends_at time #{ends_at} suppiled too late for #{clock_in_day.date}"
      end
    end
  end
end
