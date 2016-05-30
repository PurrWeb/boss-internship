class HoursAcceptancePeriod < ActiveRecord::Base
  has_paper_trail

  STATES = ['pending', 'accepted', 'deleted']

  belongs_to :clock_in_day
  belongs_to :creator, polymorphic: true
  has_many :hours_acceptance_breaks

  validates_associated :hours_acceptance_breaks
  validates :starts_at, presence: true
  validates :ends_at, presence: true
  validates :clock_in_day, presence: true
  validates :creator, presence: true
  validates :status, inclusion: { in: STATES, message: 'is required' }
  include PeriodTimeValidations

  def self.pending
    where(status: 'pending')
  end

  def self.enabled
    where('status != ?', 'deleted')
  end

  def venue
    clock_in_day.venue
  end

  def enabled?
    !deleted?
  end

  def deleted?
    status == 'deleted'
  end

  def staff_member
    clock_in_day.andand.staff_member
  end

  def date
    clock_in_day.andand.date
  end
end
