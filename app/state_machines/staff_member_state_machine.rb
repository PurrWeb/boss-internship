class StaffMemberStateMachine
  include Statesman::Machine

  state :enabled, initial: true
  state :disabled

  transition from: :enabled, to: [:disabled]

  guard_transition do |staff_member, _, metadata|
    raise 'requester_user_id required' unless metadata[:requster_user_id].present?
    true
  end

  guard_transition(from: :enabled, to: :disabled) do |staff_member, _, metadata|
    raise 'disable_reason required' unless metadata[:disable_reason].present?
    true
  end
end
