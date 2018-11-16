class AccessoryRefundRequest < ActiveRecord::Base
  include Statesman::Adapters::ActiveRecordQueries

  belongs_to :staff_member
  belongs_to :accessory_request
  belongs_to :created_by_user, class_name: "User"
  has_many :accessory_refund_request_transitions
  belongs_to :finance_report

  validates :price_cents, presence: true
  validates :accessory_request, presence: true
  validates :staff_member, presence: true
  validates :accessory_request, uniqueness: { scope: :staff_member, message: "can have only one refund request" }
  validates :completed_at, presence: true, if: :completed?
  validates :completed_at, absence: true, unless: :completed?
  validates :payslip_date, presence: true, if: :requires_finance_report?
  validates :finance_report, presence: true, if: :requires_finance_report?
  validate do |accessory_refund_request|
    if completed?
      PayslipDateValidator.new(item: accessory_refund_request).validate_all
    end
  end

  def requires_finance_report?
    staff_member.present? &&
      staff_member.can_have_finance_reports? &&
      completed?
  end

  def state_machine
    @state_machine ||= AccessoryRefundRequestStateMachine.new(
      self,
      transition_class: AccessoryRefundRequestTransition,
      association_name: :accessory_refund_request_transitions)
  end

  def self.transition_class
    AccessoryRefundRequestTransition
  end

  def self.initial_state
    AccessoryRefundRequestStateMachine.initial_state
  end

  def accepted?
    state_machine.current_state == "accepted"
  end

  def completed?
    state_machine.current_state == "completed"
  end

  def boss_frozen?
    finance_report.andand.done?
  end

  delegate \
    :can_transition_to?,
    :transition_to!,
    :transition_to,
    :current_state,
    :last_transition,
    to: :state_machine
end
