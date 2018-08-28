class AccessoryRefundRequestStateMachine
  include Statesman::Machine

  state :pending, initial: true
  state :accepted
  state :rejected
  state :completed

  transition from: :pending, to: [:accepted, :rejected]
  transition from: :rejected, to: [:pending]
  transition from: :accepted, to: [:pending, :completed]

  after_transition(from: :accepted, to: :completed) do |model, transition|
    model.completed_at = Time.now.utc
    model.payslip_date = RotaWeek.new(RotaShiftDate.to_rota_date(Time.current)).start_date
    model.save
  end

  guard_transition do |model, transition|
    model.validate
  end
end
