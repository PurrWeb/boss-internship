class SecurityShiftRequest < ActiveRecord::Base
  include Statesman::Adapters::ActiveRecordQueries

  belongs_to :created_shift, class_name: "RotaShift"
  belongs_to :creator, class_name: "User"
  belongs_to :venue
  has_many :security_shift_request_transitions

  scope :accepted, -> { in_state(:accepted) }

  validates :creator, presence: true
  validates :starts_at, presence: true
  validates :ends_at, presence: true
  validates :created_shift, presence: true, if: :assigned?
  # validates :reject_reason, presence: true, if: :rejected?

  def state_machine
    @state_machine ||= SecurityShiftRequestStateMachine.new(self,
      transition_class: SecurityShiftRequestTransition,
      association_name: :security_shift_request_transitions
    )
  end

  def self.transition_class
    SecurityShiftRequestTransition
  end

  def self.initial_state
    SecurityShiftRequestStateMachine.initial_state
  end

  def assigned?
    current_state == 'assigned'
  end

  def pending?
    current_state == 'pending'
  end

  def accepted?
    current_state == 'accepted'
  end

  def rejected?
    current_state == 'rejected'
  end

  delegate \
    :can_transition_to?,
    :transition_to!,
    :transition_to,
    :current_state,
    :last_transition,
    to: :state_machine
end
