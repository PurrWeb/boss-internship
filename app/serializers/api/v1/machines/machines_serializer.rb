class Api::V1::Machines::MachinesSerializer < ActiveModel::Serializer
  attributes  :id,
              :venueId,
              :creatorId,
              :createdAt,
              :disabledAt,
              :name,
              :location,
              :floatCents,
              :initialRefillX10p,
              :initialCashInX10p,
              :initialCashOutX10p

  def venueId
    object.venue.id
  end
  
  def createdAt
    object.created_at.iso8601
  end

  def disabledAt
    object.disabled_at.andand.iso8601
  end

  def creatorId
    object.created_by_user.id
  end

  def floatCents
    object.float_cents
  end

  def initialRefillX10p
    object.initial_refill_x_10p
  end

  def initialCashInX10p
    object.initial_cash_in_x_10p
  end

  def initialCashOutX10p
    object.initial_cash_out_x_10p
  end

end  
