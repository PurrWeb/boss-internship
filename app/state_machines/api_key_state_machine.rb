class ApiKeyStateMachine
  include Statesman::Machine

  state :active, initial: true
  state :deleted

  transition from: :active, to: [:deleted]

  guard_transition do |change_order, _, metadata|
    raise 'requster_user_id required' unless metadata[:requster_user_id].present?
    true
  end
end
