class MaintenanceTaskStateMachine
  include Statesman::Machine

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

  #Lower value first by default
  def self.sort_keys(sort_type:)
    case sort_type
    when :priority_focused
      {
        rejected: -3,
        pending:  -2,
        completed: -1,
        accepted: 0
      }
    when :status_focused
      {
        completed: -3,
        rejected: -2,
        pending:  -1,
        accepted: 0
      }
    else
      raise "unsupported sort type #{sort_type} encountered"
    end
  end
end
