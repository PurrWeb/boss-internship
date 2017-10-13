class Api::V1::MachinesRefloats::MachinesRefloatSerializer < ActiveModel::Serializer
  attributes  :id,
              :refillX10p,
              :cashInX10p,
              :cashOutX10p,
              :createdAt,
              :createdBy,
              :machineId,
              :floatTopupCents,
              :calculatedFloatTopupCents,
              :floatTopupNote,
              :moneyBankedCents,
              :calculatedMoneyBankedCents,
              :moneyBankedNote,
              :lastMachineRefloatId,
              :machineFloatCents,
              :lastRefillCents,
              :lastCashInCents,
              :lastCashOutCents,
              :lastCalculatedFloatTopupCents,
              :lastCalculatedMoneyBankedCents,
              :lastFloatTopupCents,
              :lastMoneyBankedCents

  def initialize(object, options = {})
    super(object, options)

    last_machine = object.machine.venue.machines_refloats.find_by(id: object.last_machine_refloat_id)
    @float_cents = object.machine.float_cents
    @last_refill_x_10p = last_machine.present? ? last_machine.refill_x_10p : object.machine.initial_refill_x_10p
    @last_cash_in_x_10p = last_machine.present? ? last_machine.cash_in_x_10p : object.machine.initial_cash_in_x_10p
    @last_cash_out_x_10p = last_machine.present? ? last_machine.cash_out_x_10p : object.machine.initial_cash_out_x_10p
    @last_calculated_float_topup_cents = last_machine.present? ? last_machine.calculated_float_topup_cents : 0
    @last_calculated_money_banked_cents = last_machine.present? ? last_machine.calculated_money_banked_cents : 0
    @last_float_topup_cents = last_machine.present? ? last_machine.float_topup_cents : 0
    @last_money_banked_cents = last_machine.present? ? last_machine.money_banked_cents : 0
  end

  def refillX10p
    object.refill_x_10p
  end

  def cashInX10p
    object.cash_in_x_10p
  end

  def cashOutX10p
    object.cash_out_x_10p
  end

  def floatTopupCents
    object.float_topup_cents
  end

  def calculatedFloatTopupCents
    object.calculated_float_topup_cents
  end

  def floatTopupNote
    object.float_topup_note
  end

  def moneyBankedCents
    object.money_banked_cents
  end

  def calculatedMoneyBankedCents
    object.calculated_money_banked_cents
  end

  def moneyBankedNote
    object.money_banked_note
  end

  def machineId
    object.machine_id
  end

  def createdAt
    object.created_at
  end

  def createdBy
    object.user.name.full_name
  end

  def lastMachineRefloatId
    object.last_machine_refloat_id
  end

  def machineFloatCents
    @float_cents
  end

  def lastRefillCents
    @last_refill_x_10p
  end

  def lastCashInCents
    @last_cash_in_x_10p
  end

  def lastCashOutCents
    @last_cash_out_x_10p
  end

  def lastCalculatedFloatTopupCents
    @last_calculated_float_topup_cents
  end

  def lastCalculatedMoneyBankedCents
    @last_calculated_money_banked_cents
  end

  def lastFloatTopupCents
    @last_float_topup_cents
  end

  def lastMoneyBankedCents
    @last_money_banked_cents
  end
end  
