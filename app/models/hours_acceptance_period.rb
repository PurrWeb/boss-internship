class HoursAcceptancePeriod < ActiveRecord::Base
  has_paper_trail

  ACCEPTED_STATE = 'accepted'
  STATES = ['pending', ACCEPTED_STATE, 'deleted']

  belongs_to :clock_in_day
  belongs_to :creator, polymorphic: true
  belongs_to :frozen_by, class_name: 'FinanceReport', foreign_key: 'frozen_by_finance_report_id'
  has_many :hours_acceptance_breaks

  validates_associated :hours_acceptance_breaks
  validates :starts_at, presence: true
  validates :ends_at, presence: true
  validates :clock_in_day, presence: true
  validates :creator, presence: true
  validates :status, inclusion: { in: STATES, message: 'is required' }

  include PeriodTimeValidations

  def editable?
    staff_member.enabled? && !frozen?
  end

  def self.accepted
    where(status: ACCEPTED_STATE)
  end

  def self.pending
    where(status: 'pending')
  end

  def self.enabled
    where('status != ?', 'deleted')
  end

  def venue
    clock_in_day.venue
  end

  def frozen?
    frozen_by.present?
  end

  def enabled?
    !deleted?
  end

  def accepted?
    status == ACCEPTED_STATE
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

  def payable_hours
    hour_length - hours_acceptance_breaks.enabled.inject(0) do |sum, _break|
      sum + _break.hour_length
    end
  end

  def hour_length
    (ends_at - starts_at) / 1.hour
  end
end
