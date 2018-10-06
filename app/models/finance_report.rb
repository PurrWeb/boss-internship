class FinanceReport < ActiveRecord::Base
  REPORT_STATUS_READY_STATUS = 'ready'
  REPORT_STATUS_DONE_STATUS = 'done'

  include Statesman::Adapters::ActiveRecordQueries

  belongs_to :staff_member
  belongs_to :venue
  has_many :finance_report_transitions, autosave: false

  has_many :holidays
  has_many :owed_hours
  has_many :accessory_requests
  has_many :accessory_refund_requests
  has_many :hours_acceptance_periods

  validates :staff_member, presence: true
  validates :venue, presence: true
  validates :week_start, presence: true
  validates :requiring_update, inclusion: { in: [true, false], message: 'is required' }
  validates :venue_name, presence: true
  validates :staff_member_name, presence: true
  validates :pay_rate_description, presence: true
  validates :accessories_cents, presence: true, unless: :requiring_update?
  validates_inclusion_of :contains_time_shifted_owed_hours, in: [true, false], unless: :requiring_update?
  validates_inclusion_of :contains_time_shifted_holidays, in: [true, false], unless: :requiring_update?
  validates :monday_hours_count, numericality: { greater_than_or_equal_to: 0 }, if: :done?
  validates :monday_hours_count, presence: true, unless: :requiring_update?
  validates :tuesday_hours_count, numericality: { greater_than_or_equal_to: 0 }, if: :done?
  validates :tuesday_hours_count, presence: true, unless: :requiring_update?
  validates :wednesday_hours_count, numericality: { greater_than_or_equal_to: 0 }, if: :done?
  validates :wednesday_hours_count, presence: true, unless: :requiring_update?
  validates :thursday_hours_count, numericality: { greater_than_or_equal_to: 0 }, if: :done?
  validates :thursday_hours_count, presence: true, unless: :requiring_update?
  validates :friday_hours_count, numericality: { greater_than_or_equal_to: 0 }, if: :done?
  validates :friday_hours_count, presence: true, unless: :requiring_update?
  validates :saturday_hours_count, numericality: { greater_than_or_equal_to: 0 }, if: :done?
  validates :saturday_hours_count, presence: true, unless: :requiring_update?
  validates :sunday_hours_count, numericality: { greater_than_or_equal_to: 0 }, if: :done?
  validates :sunday_hours_count, presence: true, unless: :requiring_update?
  validates :owed_hours_minute_count, numericality: { greater_than_or_equal_to: 0 }, if: :done?
  validates :owed_hours_minute_count, presence: true, unless: :requiring_update?
  validates :total_hours_count, numericality: { greater_than_or_equal_to: 0 }, if: :done?
  validates :total_hours_count, presence: true, unless: :requiring_update?
  validates :holiday_days_count, numericality: { greater_than_or_equal_to: 0 }, if: :done?
  validates :holiday_days_count, presence: true, unless: :requiring_update?
  validate :total_cents_valid
  validate  :week_start_valid
  validate :requiring_update_matches_status

  # Used by services to makes statesman play well with our validations
  attr_accessor :override_status_match_validation

  # This must be set by the service to avoid accidental calling without updating dependant records
  attr_accessor :allow_mark_completed

  # validation
  def total_cents_valid
    if total_cents.present? && done? && (total_cents < 0)
      errors.add(:total_cents, 'must be < 0')
    end
  end

  # validation
  def requiring_update_matches_status
    if (
      !override_status_match_validation && (
        (in_requiring_update_state? && requiring_update != true) ||
        (!in_requiring_update_state? && requiring_update != false)
      )
    )
      errors.add(:requiring_update, 'must match status')
    end
  end

  #validation
  def week_start_valid
    return unless week_start.present?
    if RotaWeek.new(week_start).start_date != week_start
      errors.add(:week_start, 'must be at start of week')
    end
  end

  def total
    (total_cents && total_cents / 100.0) || 0
  end

  def owed_hours_count
   (owed_hours_minute_count && owed_hours_minute_count / 60.0) || 0
  end

  def net_wages_cents
    wage_payments.sum(:cents)
  end

  def wage_payments
    InRangeQuery.new(
      relation: Payment.enabled.where(staff_member: staff_member),
      start_value: week.start_date,
      end_value: week.end_date,
      start_column_name: 'date',
      end_column_name: 'date'
    ).all
  end

  def week
    RotaWeek.new(week_start)
  end

  def completion_date_reached?(now: Time.current)
    current_week = RotaWeek.new(RotaShiftDate.to_rota_date(now))
    week.start_date < current_week.start_date
  end

  def current_state
    state_machine.current_state
  end

  def ready?
    current_state == FinanceReportStateMachine::READY_STATE.to_s
  end

  def in_requiring_update_state?
    current_state == FinanceReportStateMachine::REQUIRING_UPDATE_STATE.to_s
  end

  def done?
    current_state == FinanceReportStateMachine::DONE_STATE.to_s
  end

  def negative?
    total_cents.present? && (total_cents < 0)
  end

  def contains_negative_values?
    (monday_hours_count.present? && monday_hours_count < 0) ||
      (tuesday_hours_count.present? && tuesday_hours_count < 0) ||
      (wednesday_hours_count.present? && wednesday_hours_count < 0) ||
      (thursday_hours_count.present? && thursday_hours_count < 0) ||
      (friday_hours_count.present? && friday_hours_count < 0) ||
      (saturday_hours_count.present? && saturday_hours_count < 0) ||
      (sunday_hours_count.present? && sunday_hours_count < 0) ||
      (owed_hours_minute_count.present? && owed_hours_minute_count < 0) ||
      (total_hours_count.present? && total_hours_count < 0) ||
      (holiday_days_count.present? && holiday_days_count < 0)
  end

  def mark_requiring_update!
    ActiveRecord::Base.transaction do
      state_machine.transition_to!(FinanceReportStateMachine::REQUIRING_UPDATE_STATE) unless in_requiring_update_state?
    end
  end

  def mark_ready!
    ActiveRecord::Base.transaction do
      state_machine.transition_to!(FinanceReportStateMachine::READY_STATE) unless ready?
    end
  end

  def mark_completed!
    raise 'Allow mark completed not set' unless allow_mark_completed
    ActiveRecord::Base.transaction do
      state_machine.transition_to!(FinanceReportStateMachine::DONE_STATE) unless done?
    end
  end

  def self.transition_class
    FinanceReportTransition
  end

  def self.initial_state
    FinanceReportStateMachine::INITIAL_STATE
  end
  private_class_method :initial_state

  private
  def state_machine
    @state_machine ||= FinanceReportStateMachine.new(self, transition_class: FinanceReportTransition)
  end
end
