class MachinesAppApiErrors
  def initialize(machine)
    @machine = machine
  end
  attr_reader :machine

  def errors
    result = {}
    result[:base] = machine.errors[:base] if machine.errors[:base].present?

    result[:venueId] = machine.errors[:venue] if machine.errors[:venue].present?
    result[:name] = machine.errors[:name] if machine.errors[:name].present?
    result[:location] = machine.errors[:location] if machine.errors[:location].present?
    result[:floatCents] = machine.errors[:float_cents] if machine.errors[:float_cents].present?
    result[:initialRefillX10p] = machine.errors[:initial_refill_x_10p] if machine.errors[:initial_refill_x_10p].present?
    result[:initialCashInX10p] = machine.errors[:initial_cash_in_x_10p] if machine.errors[:initial_cash_in_x_10p].present?
    result[:initialCashOutX10p] = machine.errors[:initial_cash_out_x_10p] if machine.errors[:initial_cash_out_x_10p].present?
    result[:initialFloatTopupCents] = machine.errors[:initial_float_topup_cents] if machine.errors[:initial_float_topup_cents].present?

    result[:disabledAt] = machine.errors[:disabled_at] if machine.errors[:disabled_at].present?
    result[:disabledByUserId] = machine.errors[:disabled_by] if machine.errors[:disabled_by].present?
    result
  end
end
