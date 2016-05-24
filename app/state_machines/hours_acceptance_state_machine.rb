class HoursAcceptancePeriodStateMachine
  include Statesman::Machine

  state :pending, initial: true
  state :accepted
  state :deleted

  transition from: :pending, to: [:accepted, :deleted]
  transition from: :accepted, to: [:pending, :deleted]
  transition from: :deleted, to: [:pending]

  guard_transition do |hours_acceptance_period, _, metadata|
    raise 'requster_staff_member_id required' unless metadata[:requster_staff_member_id].present?
    true
  end
end
