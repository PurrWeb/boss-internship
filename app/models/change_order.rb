class ChangeOrder < ActiveRecord::Base
  include Statesman::Adapters::ActiveRecordQueries

  belongs_to :venue

  validates :venue, presence: true
  validates :five_pound_notes, presence: true
  validates :one_pound_coins, presence: true
  validates :fifty_pence_coins, presence: true
  validates :twenty_pence_coins, presence: true
  validates :ten_pence_coins, presence: true
  validates :five_pence_coins, presence: true

  has_many :change_order_transitions, autosave: false

  def self.build_default(venue:)
    new(
      venue: venue,
      five_pound_notes:   0,
      one_pound_coins:    0,
      fifty_pence_coins:  0,
      twenty_pence_coins: 0,
      ten_pence_coins:    0,
      five_pence_coins:   0
    )
  end

  def self.enabled
    not_in_state(:deleted)
  end

  def self.current
    in_state(:in_progress)
  end

  def self.accepted
    in_state(:accepted)
  end

  def self.done
    in_state(:done)
  end

  def self.for_venue(venue:)
    where(venue: venue)
  end

  def state_machine
    @state_machine ||= ChangeOrderStateMachine.new(
      self,
      transition_class: ChangeOrderTransition,
      association_name: :change_order_transitions
    )
  end

  def current_state
    state_machine.current_state
  end

  def deleted?
    current_state == 'deleted'
  end

  def in_progress?
    current_state == "in_progress"
  end

  def accepted?
    ["accepted", "done"].include?(current_state)
  end

  def accepted_at
    accepted_transition.created_at
  end

  def accepted_user
    accepted? && User.find(accepted_transition.metadata.fetch("requster_user_id"))
  end

  def done?
    current_state == "done"
  end

  def done_at
    done? && change_order_transitions.last.created_at
  end

  def done_user
    done? && User.find(change_order_transitions.last.metadata.fetch("requster_user_id"))
  end

  def five_pound_total
    five_pound_notes * 5
  end

  def one_pound_total
    one_pound_coins
  end

  def fifty_pence_total
    five_pence_coins * 0.5
  end

  def twenty_pence_total
    twenty_pence_coins * 0.2
  end

  def ten_pence_total
    ten_pence_coins * 0.1
  end

  def five_pence_total
    five_pence_coins * 0.05
  end

  def total
    five_pound_total +
      one_pound_total +
      fifty_pence_total +
      twenty_pence_total +
      ten_pence_total +
      five_pence_total
  end

  private
  def accepted_transition
    change_order_transitions.
    where(to_state: 'accepted').
    last
  end

  # Needed for statesman
  def self.transition_class
    ChangeOrderTransition
  end

  def self.initial_state
    ChangeOrderStateMachine.initial_state
  end
end
