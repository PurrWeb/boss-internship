class AccessoryRequest < ActiveRecord::Base
  include Statesman::Adapters::ActiveRecordQueries

  belongs_to :staff_member
  belongs_to :accessory
  has_many :accessory_request_transitions
  has_one :accessory_refund_request

  enum accessory_type: [:misc, :uniform]

  validates :accessory_type, presence: true
  validates :price_cents, presence: true
  validates :accessory, presence: true
  validates :staff_member, presence: true
  validates :size, presence: true, if: :uniform?

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

  delegate \
    :can_transition_to?,
    :transition_to!,
    :transition_to,
    :current_state,
    to: :state_machine
end
