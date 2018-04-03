class HolidayRequestStateMachine
  include Statesman::Machine

  state :pending, initial: true
  state :accepted
  state :rejected
  state :disabled

  transition from: :pending, to: [:accepted, :rejected, :disabled]
  transition from: :rejected, to: [:disabled]
  transition from: :accepted, to: [:disabled]
  transition from: :disabled, to: [:pending]
end
