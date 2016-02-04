class RotaStatusStateMachine
  include Statesman::Machine

  state :in_progress, initial: true
  state :finished
  state :published

  transition from: :in_progress, to: [:finished]
  transition from: :finished, to: [:published, :in_progress]
end
