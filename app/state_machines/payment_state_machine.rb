class PaymentStateMachine
  include Statesman::Machine

  state :pending, initial: true
  state :received

  transition from: :pending, to: [:received]

  after_transition(from: :pending, to: :received) do |model, transition|
    model.received_at = Time.current
    model.save!
  end

  guard_transition do |model, transition|
    model.validate
  end
end
