class SecurityShiftRequest < ActiveRecord::Base
  include Statesman::Adapters::ActiveRecordQueries

  belongs_to :created_shift, class_name: "RotaShift"
  belongs_to :creator, class_name: "User"
  belongs_to :venue
  has_many :security_shift_request_transitions
  validates_associated :created_shift

  scope :accepted, -> { in_state(:accepted) }

  validates :creator, presence: true
  validates :starts_at, presence: true
  validates :ends_at, presence: true
  validate :times_in_correct_order
  validate :times_in_fifteen_minute_increments, if: :pending?
  validates :created_shift, presence: true, if: :assigned?
  validates :reject_reason, presence: true, if: :rejected?

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

  private
  # validation
  def times_in_correct_order
    if starts_at.present? && ends_at.present?
      errors.add(:base, 'starts time must be after end time') if starts_at >= ends_at
    end
  end

  # validation
  def times_in_fifteen_minute_increments
    [:starts_at, :ends_at].each do |field|
      time = public_send(field)
      if time.present?
        minute = Integer(time.strftime('%M'))
        if ![0, 30].include?(minute)
          errors.add(field, 'must be 30 minute intervals')
        end
      end
    end
  end
end
