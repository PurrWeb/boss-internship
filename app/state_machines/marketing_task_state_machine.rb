class MarketingTaskStateMachine
  include Statesman::Machine

  state :pending, initial: true
  state :completed
  state :disabled

  transition from: :pending, to: [:completed, :disabled]
  transition from: :completed, to: [:disabled, :pending]
  transition from: :disabled, to: [:pending, :completed]
end
