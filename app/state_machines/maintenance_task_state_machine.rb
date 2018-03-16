class MaintenanceTaskStateMachine
  include Statesman::Machine

  #Lower value first by default
  STATE_SORT_KEYS = {
    accepted: 0,
    pending:  -1,
    completed: -2,
    rejected: -3,
  }

  state :pending, initial: true
  state :completed
  state :rejected
  state :accepted

  transition from: :pending, to: [:completed]
  transition from: :completed, to: [:rejected, :accepted]
  transition from: :accepted, to: [:rejected]
  transition from: :rejected, to: [:completed]

  def transition_allowed_for_user?(user, state)
    if user.maintenance_staff?
      [:pending, :completed].include?(state.to_sym)
    else
      true
    end
  end
end
