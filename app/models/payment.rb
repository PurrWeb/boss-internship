class Payment < ActiveRecord::Base
  include Statesman::Adapters::ActiveRecordQueries

  belongs_to :staff_member
  belongs_to :created_by_user, class_name: "User", foreign_key: 'created_by_user_id'
  belongs_to :disabled_by_user, class_name: 'User', foreign_key: 'disabled_by_user_id'
  has_many :payment_transitions, autosave: false

  validates :staff_member, presence: true
  validates :created_by_user, presence: true
  validates :date, presence: true
  validates :cents, presence: true
  validates :received_at, presence: true, if: :marked_as_received?

  def state_machine
    @state_machine ||= PaymentStateMachine.new(
      self,
      transition_class: PaymentTransition,
      association_name: :payment_transitions
    )
  end

  def current_state
    return 'disabled' if disabled?
    state_machine.current_state
  end

  def disabled?
    disabled_at.present?
  end

  def marked_as_received?
    current_state == 'received'
  end

  def self.enabled
    where(disabled_at: nil)
  end

  def self.disabled
    where('disabled_at IS NOT ?', nil)
  end

  private
  # Needed for statesman
  def self.transition_class
    PaymentTransition
  end

  def self.initial_state
    PaymentStateMachine.initial_state
  end
end
