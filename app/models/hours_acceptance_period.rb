class HoursAcceptancePeriod < ActiveRecord::Base
  STATES = ['pending', 'accepted', 'deleted']

  belongs_to :clock_in_day
  belongs_to :creator, polymorphic: true
  has_many :hours_acceptance_breaks

  validates :clock_in_day, presence: true
  validates :creator, presence: true
  validates :state, inclusion: { in: STATES, message: 'is required' }
end
