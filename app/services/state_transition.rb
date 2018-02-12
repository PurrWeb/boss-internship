class StateTransition
  attr_reader :requester, :state_machine, :transition_to
  attr_accessor :api_errors

  def initialize(requester:, state_machine:, transition_to:)
    @requester = requester
    @state_machine = state_machine
    @transition_to = transition_to
    @api_errors = {}
  end

  def transition
    validate_transition_to_is_acceptable

    return false if invalid?

    state_machine.transition_to!(
      transition_to,
      requester_user_id: requester.id
    )

    true
  rescue Statesman::GuardFailedError => e
    api_errors[:base] = [e.message]

    false
  rescue Statesman::TransitionFailedError => e
    api_errors[:base] = [e.message]

    false
  end

  def valid?
    api_errors.keys.blank?
  end

  def invalid?
    !valid?
  end

  private

  def validate_transition_to_is_acceptable
    if state_machine.allowed_transitions.exclude?(transition_to)
      api_errors[:transition_to] = ['transition not allowed']
    end
  end
end