class FinanceReport < ActiveRecord::Base
  REPORT_STATUS_INCOMPLETE_STATUS = 'incomplete'
  REPORT_STATUS_READY_STATUS = 'ready'
  REPORT_STATUS_DONE_STATUS = 'done'

  include Statesman::Adapters::ActiveRecordQueries

  belongs_to :staff_member
  belongs_to :venue
  has_many :finance_report_transitions, autosave: false

  validates :staff_member, presence: true
  validates :venue, presence: true
  validates :week_start, presence: true
  validates :requiring_update, inclusion: { in: [true, false], message: 'is required' }
  validate :requiring_update_matches_status
  validates :venue_name, presence: true, unless: :requiring_update?
  validates :staff_member_name, presence: true, unless: :requiring_update?
  validates :pay_rate_description, presence: true, unless: :requiring_update?
  validates :accessories_cents, presence: true, unless: :requiring_update?
  validates_inclusion_of :contains_time_shifted_owed_hours, in: [true, false], unless: :requiring_update?
  validates_inclusion_of :contains_time_shifted_holidays, in: [true, false], unless: :requiring_update?
  validates :monday_hours_count, numericality: { greater_than_or_equal_to: 0 }, unless: :requiring_update?
  validates :tuesday_hours_count, numericality: { greater_than_or_equal_to: 0 }, unless: :requiring_update?
  validates :wednesday_hours_count, numericality: { greater_than_or_equal_to: 0 }, unless: :requiring_update?
  validates :thursday_hours_count, numericality: { greater_than_or_equal_to: 0 }, unless: :requiring_update?
  validates :friday_hours_count, numericality: { greater_than_or_equal_to: 0 }, unless: :requiring_update?
  validates :saturday_hours_count, numericality: { greater_than_or_equal_to: 0 }, unless: :requiring_update?
  validates :sunday_hours_count, numericality: { greater_than_or_equal_to: 0 }, unless: :requiring_update?
  validates :total_hours_count, numericality: { greater_than_or_equal_to: 0 }, unless: :requiring_update?
  validates :owed_hours_minute_count, numericality: { greater_than_or_equal_to: 0 }, unless: :requiring_update?
  validates :total_cents, numericality: { greater_than_or_equal_to: 0 }, unless: :requiring_update?
  validates :holiday_days_count, numericality: { greater_than_or_equal_to: 0 }, unless: :requiring_update?
  validate  :week_start_valid

  #used by services to makes statesman play well with our validations
  attr_accessor :override_status_match_validation

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

  #validation
  def week_start_valid
    return unless week_start.present?
    if RotaWeek.new(week_start).start_date != week_start
      errors.add(:week_start, 'must be at start of week')
    end
  end

  def current_state
    state_machine.current_state
  end

  def incomplete?
    current_state == FinanceReportStateMachine::INCOMPLETE_STATE.to_s
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

  def mark_requiring_update!
    ActiveRecord::Base.transaction do
      state_machine.transition_to!(FinanceReportStateMachine::REQUIRING_UPDATE_STATE)
    end
  end

  def mark_incomplete!
    ActiveRecord::Base.transaction do
      state_machine.transition_to!(FinanceReportStateMachine::INCOMPLETE_STATE)
    end
  end

  def mark_ready!
    ActiveRecord::Base.transaction do
      state_machine.transition_to!(FinanceReportStateMachine::READY_STATE)
    end
  end

  def mark_completed!
    ActiveRecord::Base.transaction do
      state_machine.transition_to!(FinanceReportStateMachine::DONE_STATE)
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
