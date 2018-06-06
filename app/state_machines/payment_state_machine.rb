class PaymentStateMachine
  include Statesman::Machine

  state :pending, initial: true
  state :received

  transition from: :pending, to: [:received]
  transition from: :received, to: :pending

  after_transition(from: :pending, to: :received) do |model, transition|
    model.received_at = Time.current
    model.save!
  end

  after_transition(from: :received, to: :pending) do |model, transition|
    model.received_at = nil
    model.save!
  end

  guard_transition do |model, transition|
    model.validate
  end
end
