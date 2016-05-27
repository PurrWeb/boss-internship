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

  delegate :venue, :staff_member, :date, to: :clock_in_day

  def self.incomplete
    where(ends_at: nil)
  end
end
