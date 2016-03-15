class StaffMemberStateMachine
  include Statesman::Machine

  state :enabled, initial: true
  state :disabled

  transition from: :enabled, to: [:disabled]
end
