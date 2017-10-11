class MachinesRefloatsCalculationService
  def initialize(machines_refloat:)
    @machines_refloat = machines_refloat
    @machine = machines_refloat.machine
    machine_float_topup_cents = machine.initial_float_topup_cents
    machine_float_cents = machine.float_cents

    @last_machine_refloat = MachinesRefloat.find_by(id: machines_refloat.last_machine_refloat_id)
    if !last_machine_refloat.present?
      @last_machine_refloat = machine.machines_refloats.order(:created_at).last
    end
    @last_float_topup_cents = last_machine_refloat.present? ? last_machine_refloat.float_topup_cents : machine_float_topup_cents
    last_money_banked_cents = last_machine_refloat.present? ? last_machine_refloat.money_banked_cents : machine_float_topup_cents
    last_calculated_float_topup_cents = last_machine_refloat.present? ? last_machine_refloat.calculated_float_topup_cents : machine_float_cents
    last_calculated_money_banked_cents = last_machine_refloat.present? ? last_machine_refloat.calculated_money_banked_cents : 0

    @last_untoppedup_float_cents = last_machine_refloat.present? ? last_calculated_float_topup_cents - last_float_topup_cents : 0
    @last_unbanked_cents = last_calculated_money_banked_cents - last_money_banked_cents

    last_cash_in_cents = last_machine_refloat.present? ? last_machine_refloat.cash_in_x_10p * 10 : machine.initial_cash_in_x_10p * 10
    last_cash_out_cents = last_machine_refloat.present? ? last_machine_refloat.cash_out_x_10p * 10 : machine.initial_cash_out_x_10p * 10
    last_refill_cents = last_machine_refloat.present? ? last_machine_refloat.refill_x_10p * 10 : machine.initial_refill_x_10p * 10
    cash_in_x_10p_cents = machines_refloat.cash_in_x_10p * 10
    cash_out_x_10p_cents = machines_refloat.cash_out_x_10p * 10
    refill_x_10p_cents = machines_refloat.refill_x_10p * 10

    @cash_in_x_10p_diff_cents = cash_in_x_10p_cents - last_cash_in_cents
    @cash_out_x_10p_diff_cents = cash_out_x_10p_cents - last_cash_out_cents
    @refill_x_10p_diff_cents = refill_x_10p_cents - last_refill_cents
  end

  def calculated_float_topup_cents
    cash_out_x_10p_diff_cents - (refill_x_10p_diff_cents - last_float_topup_cents) + last_untoppedup_float_cents
  end

  def calculated_money_banked_cents
    cash_in_x_10p_diff_cents - (refill_x_10p_diff_cents - last_float_topup_cents) + last_unbanked_cents
  end

  private
  attr_reader \
    :machines_refloat,
    :machine,
    :last_machine_refloat,
    :cash_out_x_10p_diff_cents,
    :cash_in_x_10p_diff_cents,
    :refill_x_10p_diff_cents,
    :last_untoppedup_float_cents,
    :last_unbanked_cents,
    :last_float_topup_cents
end
