class ClockInEvent < ActiveRecord::Base
  TYPES = ['clock_in', 'clock_out', 'start_break', 'end_break']

  belongs_to :venue
  belongs_to :staff_member
  belongs_to :creator, polymorphic: true
  has_one :clock_in_period, through: :clock_in_period_event
  has_one :clock_in_period_event

  validates :event_type, inclusion: { in: TYPES, message: 'is required' }
  validates :venue, presence: true
  validates :staff_member, presence: true
  validates :creator, presence: true
  validates :at, presence: true

  def clock_in?
    event_type == 'clock_in'
  end

  def start_break?
    event_type == 'start_break'
  end

  def end_break?
    event_type == 'end_break'
  end

  def clock_out?
    event_type == 'clock_out'
  end
end
