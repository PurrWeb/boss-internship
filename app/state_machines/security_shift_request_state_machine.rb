class SecurityShiftRequestStateMachine
  include Statesman::Machine

  state :pending, initial: true
  state :accepted
  state :rejected
  state :assigned

  transition from: :pending, to: [:accepted, :rejected]
  transition from: :rejected, to: [:pending]
  transition from: :accepted, to: [:pending, :assigned, :rejected]

  after_transition(from: :rejected, to: :pending) do |model, transition|
    model.reject_reason = nil
    model.save
  end

  guard_transition do |model, transition|
    model.validate
  end
end
