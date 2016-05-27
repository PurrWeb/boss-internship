class HoursAcceptancePeriod < ActiveRecord::Base
  has_paper_trail

  STATES = ['pending', 'accepted', 'deleted']

  belongs_to :clock_in_day
  belongs_to :creator, polymorphic: true
  has_many :hours_acceptance_breaks

  validates :starts_at, presence: true
  validates :ends_at, presence: true
  validates :clock_in_day, presence: true
  validates :creator, presence: true
  validates :status, inclusion: { in: STATES, message: 'is required' }

  def self.pending
    where(status: 'pending')
  end

  def venue
    clock_in_day.venue
  end

  def deleted?
    status == 'deleted'
  end
end
