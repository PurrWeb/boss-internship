class HolidayRequest < ActiveRecord::Base
  include Statesman::Adapters::ActiveRecordQueries

  has_many :holiday_request_transitions, autosave: false
  belongs_to :staff_member
  belongs_to :creator, foreign_key: 'created_by_user_id', class_name: 'User'
  validates :start_date, presence: true
  validates :end_date, presence: true
  validates :creator, presence: true
  validates :staff_member, presence: true
  validates :holiday_type, inclusion: { in: Holiday::HOLIDAY_TYPES, message: 'is required' }

  def state_machine
    @state_machine ||= HolidayRequestStateMachine.new(
      self,
      transition_class: HolidayRequestTransition,
      association_name: :holiday_request_transitions
    )
  end

  def current_state
    state_machine.current_state
  end

  def days
    day_delta = (end_date - start_date).to_i
    day_delta + 1
  end

  private
  # Needed for statesman
  def self.transition_class
    HolidayRequestTransition
  end

  def self.initial_state
    HolidayRequestStateMachine.initial_state
  end
end
