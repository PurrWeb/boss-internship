class UserStateMachine
  include Statesman::Machine

  state :enabled, initial: true
  state :disabled

  transition from: :enabled, to: [:disabled]
  transition from: :disabled, to: [:enabled]

  guard_transition do |user, _, metadata|
    raise 'requester_user_id required' unless metadata[:requster_user_id].present?
    true
  end

  guard_transition(from: :enabled, to: :disabled) do |user, _, metadata|
    raise 'disable_reason required' unless metadata[:disable_reason].present?
    true
  end
end
