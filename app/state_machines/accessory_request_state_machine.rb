class AccessoryRequestStateMachine
  include Statesman::Machine

  state :pending, initial: true
  state :accepted
  state :rejected
  state :canceled
  state :completed

  transition from: :pending, to: [:accepted, :rejected, :canceled]
  transition from: :accepted, to: [:pending, :completed]
end