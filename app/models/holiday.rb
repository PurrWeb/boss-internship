class Holiday < ActiveRecord::Base
  PAID_HOLIDAY_TYPE = "paid_holiday"
  UNPAID_HOLIDAY_TYPE = "unpaid_holiday"
  SICK_LEAVE_HOLIDAY_TYPE = "sick_leave"
  UNPAID_HOLIDAY_TYPES = [UNPAID_HOLIDAY_TYPE, SICK_LEAVE_HOLIDAY_TYPE]
  HOLIDAY_TYPES = [PAID_HOLIDAY_TYPE] + UNPAID_HOLIDAY_TYPES

  include Statesman::Adapters::ActiveRecordQueries

  belongs_to :parent, class_name: "Holiday", foreign_key: 'parent_holiday_id', inverse_of: :child
  has_one :child, class_name: "Holiday", foreign_key: 'parent_holiday_id', inverse_of: :parent
  has_many :holiday_transitions, autosave: false
  belongs_to :staff_member
  belongs_to :creator, foreign_key: 'creator_user_id', class_name: 'User'
  belongs_to :finance_report
  has_one :holiday_request, foreign_key: :created_holiday_id, class_name: 'HolidayRequest'

  validates :start_date, presence: true
  validates :end_date, presence: true
  validates :creator, presence: true
  validates :staff_member, presence: true
  validates :payslip_date, presence: true, if: :requires_finance_report?
  validates :finance_report, presence: true, if: :requires_finance_report?
  validates :holiday_type, inclusion: { in: HOLIDAY_TYPES, message: 'is required' }

  validate do |holiday|
    PayslipDateValidator.new(item: holiday).validate_all
    HolidayDateValidator.new(holiday).validate
    HolidayCapValidator.new(holiday).validate
  end

  attr_accessor :validate_as_creation, :source_request, :validate_as_assignment

  def requires_finance_report?
    staff_member.present? &&
      staff_member.can_have_finance_reports? &&
      paid?
  end

  def self.paid
    where(holiday_type: PAID_HOLIDAY_TYPE)
  end

  def self.unpaid
    where(holiday_type: UNPAID_HOLIDAY_TYPES)
  end

  def state_machine
    @state_machine ||= HolidayStateMachine.new(
      self,
      transition_class: HolidayTransition,
      association_name: :holiday_transitions
    )
  end

  def current_state
    state_machine.current_state
  end

  def enabled?
    current_state == 'enabled'
  end

  def disabled?
    current_state == 'disabled'
  end

  def paid?
    holiday_type == PAID_HOLIDAY_TYPE
  end

  def created_from_request?
    holiday_request.present?
  end

  def disable!(requester:)
    state_machine.transition_to!(:disabled, requster_user_id: requester.id)
  end

  def editable?
    staff_member.enabled? && !frozen?
  end

  def days
    day_delta = (end_date - start_date).to_i
    day_delta + 1
  end

  def frozen?
    finance_report.andand.done?
  end

  private
  # Needed for statesman
  def self.transition_class
    HolidayTransition
  end

  def self.initial_state
    HolidayStateMachine.initial_state
  end
end
