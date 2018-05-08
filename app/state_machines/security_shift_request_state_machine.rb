class SecurityShiftRequestStateMachine
  include Statesman::Machine

  state :pending, initial: true
  state :accepted
  state :rejected
  state :assigned
  state :deleted

  transition from: :pending, to: [:accepted, :rejected, :deleted]
  transition from: :rejected, to: [:pending]
  transition from: :accepted, to: [:pending, :assigned, :rejected, :deleted]

  after_transition(from: :rejected, to: :pending) do |model, transition|
    model.reject_reason = nil
    model.save
  end

  guard_transition do |model, transition|
    model.validate
  end
end
