class Rota < ActiveRecord::Base
  include Statesman::Adapters::ActiveRecordQueries

  has_many :rota_forecasts, inverse_of: :rota
  has_many :rota_shifts, inverse_of: :rota
  has_many :rota_status_transitions, autosave: false
  has_many :enabled_rota_shifts, lambda { RotaShift.enabled }, class_name: "RotaShift"

  belongs_to :creator, class_name: "User"
  belongs_to :venue

  validates :creator, presence: true
  validates :date, presence: true
  validates :venue, presence: true
  validates :status, presence: true

  delegate :transition_to!, to: :state_machine

  def self.published
    in_state(:published)
  end

  def self.with_forecasts
    joins(:rota_forecasts).uniq
  end

  def status
    state_machine.current_state
  end

  def in_progress?
    state_machine.current_state.to_sym == :in_progress
  end

  def finished?
    state_machine.current_state.to_sym == :finished
  end

  def published?
    state_machine.current_state.to_sym == :published
  end

  def has_forecasts?
    rota_forecasts.count > 0
  end

  def forecastable?
    date >= RotaWeek.new(RotaShiftDate.to_rota_date(Time.current)).start_date
  end

  def start_time
    date.beginning_of_day.utc + 8.hours
  end

  def end_time
    (date + 1.day).beginning_of_day.utc + 8.hours
  end

  private
  # Needed for statesman
  def self.transition_class
    RotaStatusTransition
  end

  def self.initial_state
    RotaStatusStateMachine.initial_state
  end

  def state_machine
    @state_machine ||= RotaStatusStateMachine.new(
      self,
      transition_class: RotaStatusTransition,
      association_name: :rota_status_transitions
    )
  end
end
