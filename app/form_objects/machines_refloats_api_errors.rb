class MachinesRefloatsApiErrors
  def initialize(machine)
    @machine = machine
  end
  attr_reader :machine

  def errors
    result = {}
    result[:base] = machine.errors[:base] if machine.errors[:base].present?

    result[:venueId] = machine.errors[:venue] if machine.errors[:venue].present?
    result[:refillX10p] = machine.errors[:refill_x_10p] if machine.errors[:refill_x_10p].present?
    result[:cashInX10p] = machine.errors[:cash_in_x_10p] if machine.errors[:cash_in_x_10p].present?
    result[:cashOutX10p] = machine.errors[:cash_out_x_10p] if machine.errors[:cash_out_x_10p].present?
    result[:floatTopupError] = machine.errors[:float_topup_error] if machine.errors[:float_topup_error].present?
    result[:moneyBankedError] = machine.errors[:money_banked_error] if machine.errors[:money_banked_error].present?
    result[:floatTopupNote] = machine.errors[:float_topup_note] if machine.errors[:float_topup_note].present?
    result[:moneyBankedNote] = machine.errors[:money_banked_note] if machine.errors[:money_banked_note].present?
    result[:lastMachineRefloatId] = machine.errors[:last_machine_refloat_id] if machine.errors[:last_machine_refloat_id].present?

    result
  end
end
