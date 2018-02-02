class AccessoryRefundRequestStateMachine
  include Statesman::Machine

  state :pending, initial: true
  state :accepted
  state :rejected
  state :completed

  transition from: :pending, to: [:accepted, :rejected]
  transition from: :rejected, to: [:pending]
  transition from: :accepted, to: [:pending, :completed]
end
