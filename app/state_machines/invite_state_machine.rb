class InviteStateMachine
  include Statesman::Machine

  state :open, initial: true
  state :accepted
  state :revoked

  transition from: :open, to: [:accepted, :revoked]
end
