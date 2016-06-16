class HoursAcceptancePeriod < ActiveRecord::Base
  has_paper_trail

  STATES = ['pending', 'accepted', 'deleted']

  belongs_to :clock_in_day
  belongs_to :creator, polymorphic: true
  belongs_to :hours_acceptance_reason
  belongs_to :frozen_by, class_name: 'FinanceReport', foreign_key: 'frozen_by_finance_report_id'
  has_many :hours_acceptance_breaks

  validates_associated :hours_acceptance_breaks
  validates :starts_at, presence: true
  validates :ends_at, presence: true
  validates :clock_in_day, presence: true
  validates :creator, presence: true
  validates :status, inclusion: { in: STATES, message: 'is required' }
  validates :hours_acceptance_reason, presence: true, if: :accepted?
  validate  :validate_reason_note_presence

  include PeriodTimeValidations

  #validation
  def validate_reason_note_presence
    if hours_acceptance_reason.present?
      if hours_acceptance_reason.note_required? && reason_note.empty?
        errors.add(:reason_note, "is required when choosing #{hours_acceptance_reason.text} reason")
      elsif !hours_acceptance_reason.note_required && reason_note.present?
        errors.add(:reason_note, "must be ommited when choosing #{hours_acceptance_reason.text} reason")
      end
    end
  end

  def self.accepted
    where(status: 'accepted')
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

  def enabled?
    !deleted?
  end

  def accepted?
    status == 'accepted'
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
