class MarketingTask < ActiveRecord::Base
  include Statesman::Adapters::ActiveRecordQueries
  include Disableable

  serialize :days, Array

  # Associations
  belongs_to :venue
  belongs_to :disabled_by_user, class_name: 'User'
  belongs_to :completed_by_user, class_name: 'User'
  belongs_to :created_by_user, class_name: 'User'
  belongs_to :assigned_to_user, class_name: 'User'
  has_many :marketing_task_transitions, autosave: false
  has_many :marketing_task_notes
  has_many :marketing_task_assignments
  has_many :timeline_activities

  # Validations
  validates :title, :type, :due_at, :created_by_user, :venue, presence: true

  def timeline_activities
    [
      marketing_task_assignments + marketing_task_transitions
    ].flatten.sort_by { |activity| activity.created_at }.reverse
  end

  def disable(current_user)
    ActiveRecord::Base.transaction do
      update!(
        disabled_by_user: current_user,
        disabled_at: Time.current
      )

      state_transition = StateTransition.new({
        requester: current_user,
        state_machine: self.state_machine,
        transition_to: 'disabled'
      }).transition

      true && state_transition
    end
  rescue
    false
  end

  def restore(current_user)
    ActiveRecord::Base.transaction do
      update!(
        disabled_by_user: nil,
        disabled_at: nil
      )

      state_transition = StateTransition.new({
        requester: current_user,
        state_machine: self.state_machine,
        transition_to: 'pending'
      }).transition

      true && state_transition
    end
  rescue
    false
  end

  # Statesman methods start
  def state_machine
    @state_machine ||= MarketingTaskStateMachine.new(
      self,
      transition_class: MarketingTaskTransition,
      association_name: :marketing_task_transitions
    )
  end

  def self.transition_class
    MarketingTaskTransition
  end

  private_class_method :initial_state
  def self.initial_state
    :pending
  end
  # Statesman methods end
end
