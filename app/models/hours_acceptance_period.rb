class HoursAcceptancePeriod < ActiveRecord::Base
  has_paper_trail

  ACCEPTED_STATE = 'accepted'
  PENDING_STATE = 'pending'
  DELETED_STATE = 'deleted'
  STATES = [PENDING_STATE, ACCEPTED_STATE, DELETED_STATE]

  belongs_to :clock_in_day
  belongs_to :creator, polymorphic: true
  belongs_to :accepted_by, class_name: 'User', foreign_key: 'accepted_by_id'
  belongs_to :finance_report
  has_many :hours_acceptance_breaks
  has_many :hours_acceptance_breaks_enabled, -> (_o) {
    where(disabled_at: nil)
  }, class_name: 'HoursAcceptanceBreak'

  validates_associated :hours_acceptance_breaks
  validates :starts_at, presence: true
  validates :ends_at, presence: true
  validates :clock_in_day, presence: true
  validates :creator, presence: true
  validates :status, inclusion: { in: STATES, message: 'is required' }
  validates :accepted_at, presence: true, if: :accepted?
  validates :accepted_by, presence: true, if: :accepted?
  validates :finance_report, presence: true, if: :requires_finance_report?
  validate :finance_repot_matches_date

  include PeriodTimeValidations

  def requires_finance_report?
    staff_member.present? &&
      staff_member.can_have_finance_reports? &&
      accepted?
  end

  #validation
  def finance_repot_matches_date
    if date.present? && finance_report.present?
      errors.add(:base, 'date must match finance report') if RotaWeek.new(date).start_date != finance_report.week_start
    end
  end

  def times_overlap_validations
    HoursAcceptancePeriodTimeOverlapValidator.new(self).validate if enabled?
  end

  def editable?
    !frozen?
  end

  def self.accepted
    where(status: ACCEPTED_STATE)
  end

  def self.pending
    where(status: PENDING_STATE)
  end

  def self.enabled
    where('status != ?', DELETED_STATE)
  end

  def venue
    clock_in_day.venue
  end

  def frozen?
    finance_report.andand.done?
  end

  def enabled?
    !deleted?
  end

  def accepted?
    status == ACCEPTED_STATE
  end

  def deleted?
    status == DELETED_STATE
  end

  def staff_member
    clock_in_day.andand.staff_member
  end

  def date
    clock_in_day.andand.date
  end

  def payable_hours
    hour_length - break_hour_length
  end

  def break_hour_length
    hours_acceptance_breaks_enabled.inject(0) do |sum, _break|
      sum + _break.hour_length
    end
  end

  def hour_length
    (ends_at - starts_at) / 1.hour
  end
end
