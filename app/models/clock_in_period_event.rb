class ClockInPeriodEvent < ActiveRecord::Base
  belongs_to :clock_in_period
  belongs_to :clocking_event
end
