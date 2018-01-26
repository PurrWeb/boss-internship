class AccessoryRefundRequestStateMachine
  include Statesman::Machine

  state :pending, initial: true
  state :accepted
  state :rejected

  transition from: :pending, to: [:accepted, :rejected]
end
