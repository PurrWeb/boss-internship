class ClockInEvent < ActiveRecord::Base
  TYPES = ['clock_in', 'clock_out', 'start_break', 'end_break']

  belongs_to :creator, polymorphic: true
  belongs_to :clock_in_period

  validates :clock_in_period, presence: true
  validates :event_type, inclusion: { in: TYPES, message: 'is required' }
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
