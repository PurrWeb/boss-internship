class AccessoryRequestStateMachine
  include Statesman::Machine

  state :pending, initial: true
  state :accepted
  state :rejected
  state :canceled

  transition from: :pending, to: [:accepted, :rejected, :canceled]
end