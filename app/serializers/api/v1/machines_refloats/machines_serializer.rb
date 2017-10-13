class Api::V1::MachinesRefloats::MachinesSerializer < ActiveModel::Serializer
  attributes  :id,
              :name,
              :location,
              :floatCents,
              :refillX10p,
              :cashInX10p,
              :cashOutX10p,
              :lastMachineRefloatId,
              :initialFloatTopupCents

  def floatCents
    object.float_cents
  end

  def refillX10p
    object.initial_refill_x_10p
  end

  def cashInX10p
    object.initial_cash_in_x_10p
  end

  def cashOutX10p
    object.initial_cash_out_x_10p
  end

  def lastMachineRefloatId
    lastRefloat = object.machines_refloats.last
    lastRefloat.present? ? lastRefloat.id : nil
  end

  def initialFloatTopupCents
    object.initial_float_topup_cents
  end
end  
