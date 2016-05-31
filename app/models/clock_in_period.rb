class ClockInPeriod < ActiveRecord::Base
  belongs_to :clock_in_day
  belongs_to :creator, polymorphic: true
  has_many :clock_in_events
  has_many :clock_in_breaks

  validates_associated :clock_in_breaks
  validates :clock_in_day, presence: true
  validates :creator, presence: true
  validates :starts_at, presence: true
  include PeriodTimeValidations

  delegate :venue, :date, to: :clock_in_day

  def self.incomplete
    where(ends_at: nil)
  end

  def staff_member
    clock_in_day.andand.staff_member
  end

  def enabled?
    true
  end
end
