class HoursAcceptancePeriod < ActiveRecord::Base
  include Statesman::Adapters::ActiveRecordQueries

  belongs_to :clock_in_day
  belongs_to :creator, polymorphic: true
  has_many :hours_acceptance_breaks

  validates :clock_in_day, presence: true
  validates :creator, presence: true

  def state_machine
    @state_machine ||= HoursAcceptancePeriodStateMachine.new(
      self,
      transition_class: HoursAcceptancePeriodTransition,
      association_name: :clock_in_period_transitions
    )
  end

  def self.transition_class
    HoursAcceptancePeriodTransition
  end
  private_class_method :transition_class

  def self.initial_state
    HoursAcceptancePeriodStateMachine.initial_state
  end
end
