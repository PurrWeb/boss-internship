class ClockInPeriod < ActiveRecord::Base
  TYPES = ['recorded', 'created']
  belongs_to :staff_member
  belongs_to :venue
  belongs_to :clock_in_period_reason
  belongs_to :creator, class_name: 'StaffMember'
  has_many :clock_in_period_events
  has_many :clocking_events, through: :clock_in_period_events
  has_many :clock_in_breaks

  validates :period_type, inclusion: { in: TYPES, message: 'is required' }
  validates :date, presence: true
  validates :staff_member, presence: true
  validates :venue, presence: true
  validates :creator, presence: true
  validates :starts_at, presence: true
end
