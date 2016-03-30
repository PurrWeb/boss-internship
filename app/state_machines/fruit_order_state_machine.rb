class FruitOrderStateMachine
  include Statesman::Machine

  state :in_progress, initial: true
  state :accepted
  state :done
  state :deleted

  transition from: :in_progress, to: [:accepted, :deleted]
  transition from: :accepted, to: [:done, :deleted]

  guard_transition do |fruit_order, _, metadata|
    raise 'requster_user_id required' unless metadata[:requster_user_id].present?
    true
  end
end
