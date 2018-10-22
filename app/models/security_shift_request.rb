class SecurityShiftRequest < ActiveRecord::Base
  include Statesman::Adapters::ActiveRecordQueries

  belongs_to :created_shift, class_name: "RotaShift"
  belongs_to :creator, class_name: "User"
  belongs_to :deleted_by, class_name: "User"
  belongs_to :venue
  has_many :security_shift_request_transitions
  validates_associated :created_shift

  scope :accepted, -> { in_state(:accepted) }
  scope :pending, -> { in_state(:pending) }

  validates :creator, presence: true
  validates :starts_at, presence: true
  validates :ends_at, presence: true
  validates :created_shift, presence: true, if: :assigned?
  validates :reject_reason, presence: true, if: :rejected?
  validates :deleted_by, presence: true, if: :deleted?
  validate :times_in_correct_order
  validate :time_not_in_past
  validate :times_in_fifteen_minute_increments

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

  def deleted?
    current_state == 'deleted'
  end

  def deletable?(requester:)
    can_transition_to?(:deleted) && creator == requester
  end

  def acceptable?
    can_transition_to?(:accepted)
  end

  def rejectable?
    can_transition_to?(:rejected)
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

  def time_not_in_past
    return unless [:starts_at, :ends_at].all? do |method|
      public_send(method).present?
    end
    current_rota_start_time = RotaShiftDate.new(RotaWeek.new(RotaShiftDate.to_rota_date(Time.current)).start_date).start_time
    errors.add(:starts_at, "can't be in past") if starts_at < current_rota_start_time
    errors.add(:ends_at, "can't be in past") if ends_at < current_rota_start_time
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
