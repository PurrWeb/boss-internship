class ClockInInterval < ActiveRecord::Base
  TYPES = ['clock_in', 'break']

  belongs_to :start_clocking_event, class_name: 'ClockingEvent'
  belongs_to :end_clocking_event, class_name: 'ClockingEvent'

  validates :interval_type, presence: true, inclusion: { in: TYPES, message: 'is required' }
  validates :start_clocking_event, presence: true
  validates :end_clocking_event, presence: true
end
