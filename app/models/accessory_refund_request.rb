class AccessoryRefundRequest < ActiveRecord::Base
  include Statesman::Adapters::ActiveRecordQueries

  belongs_to :staff_member
  belongs_to :accessory_request
  belongs_to :created_by_user, class_name: "User"
  has_many :accessory_refund_request_transitions
  belongs_to :frozen_by, class_name: 'FinanceReport', foreign_key: 'frozen_by_id'

  validates :price_cents, presence: true
  validates :accessory_request, presence: true
  validates :staff_member, presence: true
  validates :accessory_request, uniqueness: { scope: :staff_member, message: "can have only one refund request" }
  validates :completed_at, presence: true, if: :completed?
  validates :completed_at, absence: true, unless: :completed?

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

  def completed?
    state_machine.current_state == "completed"
  end

  def frozen?
    frozen_by.present?
  end

  delegate \
    :can_transition_to?,
    :transition_to!,
    :transition_to,
    :current_state,
    :last_transition,
    to: :state_machine
end
