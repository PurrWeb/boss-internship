class AccessoryRequest < ActiveRecord::Base
  include Statesman::Adapters::ActiveRecordQueries

  belongs_to :staff_member
  belongs_to :accessory
  has_many :accessory_request_transitions
  has_one :accessory_refund_request
  belongs_to :created_by_user, class_name: "User"
  belongs_to :finance_report

  enum accessory_type: [:misc, :uniform]

  validates :accessory_type, presence: true
  validates :price_cents, presence: true
  validates :accessory, presence: true
  validates :staff_member, presence: true
  validates :size, presence: true, if: :uniform?
  validates :completed_at, presence: true, if: :completed?
  validates :completed_at, absence: true, unless: :completed?
  validates :payslip_date, presence: true, if: :requires_finance_report?
  validates :finance_report, presence: true, if: :requires_finance_report?
  validate do |accessory_request|
    if completed?
      PayslipDateValidator.new(item: accessory_request, allow_past_payslip_date_manupulation: @allow_past_payslip_date_manupulation).validate_all
    end
  end

  def requires_finance_report?
    staff_member.present? &&
      staff_member.can_have_finance_reports? &&
      completed?
  end

  def state_machine
    @state_machine ||= AccessoryRequestStateMachine.new(
      self,
      transition_class: AccessoryRequestTransition,
      association_name: :accessory_request_transitions)
  end

  def self.transition_class
    AccessoryRequestTransition
  end

  def self.initial_state
    AccessoryRequestStateMachine.initial_state
  end

  def accepted?
    state_machine.current_state == "accepted"
  end

  def completed?
    state_machine.current_state == "completed"
  end

  def has_refund_request?
    completed? && accessory_refund_request.present?
  end

  def boss_frozen?
    !!finance_report.andand.done?
  end

  def allowing_past_payslip_date_manupulation
    @allow_past_payslip_date_manupulation = true
    yield self
    @allow_past_payslip_date_manupulation = false
  end

  delegate \
    :can_transition_to?,
    :transition_to!,
    :transition_to,
    :current_state,
    :last_transition,
    to: :state_machine
end
