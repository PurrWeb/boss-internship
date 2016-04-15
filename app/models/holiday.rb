class Holiday < ActiveRecord::Base
  HOLIDAY_TYPES = ['paid_holiday', 'unpaid_holiday']

  include Statesman::Adapters::ActiveRecordQueries

  belongs_to :parent, class_name: "Holiday", foreign_key: 'parent_holiday_id', inverse_of: :child
  has_one :child, class_name: "Holiday", foreign_key: 'parent_holiday_id', inverse_of: :parent
  has_many :holiday_transitions, autosave: false
  belongs_to :staff_member
  belongs_to :creator, foreign_key: 'creator_user_id', class_name: 'User'

  validates :start_date, presence: true
  validates :end_date, presence: true
  validates :creator, presence: true
  validates :staff_member, presence: true
  validates :holiday_type, inclusion: { in: HOLIDAY_TYPES, message: 'is required' }

  validate do |holiday|
    HolidayDateValidator.new(holiday).validate
  end

  def self.paid
    where(holiday_type: 'paid_holiday')
  end

  def self.unpaid
    where(holiday_type: 'unpaid_holiday')
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
    holiday_type == 'paid_holiday'
  end

  def disable!(requester:)
    state_machine.transition_to!(:disabled, requster_user_id: requester.id)
  end

  def editable?
    staff_member.enabled? && (end_date > Time.zone.now.to_date)
  end

  def days
    day_delta = (end_date - start_date).to_i
    day_delta + 1
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
