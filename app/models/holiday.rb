class Holiday < ActiveRecord::Base
  HOLIDAY_TYPES = ['paid_holiday', 'unpaid_holiday']

  include Statesman::Adapters::ActiveRecordQueries

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

  private
  # Needed for statesman
  def self.transition_class
    HolidayTransition
  end

  def self.initial_state
    HolidayStateMachine.initial_state
  end
end
