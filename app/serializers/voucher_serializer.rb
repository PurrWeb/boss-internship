class VoucherSerializer < ActiveModel::Serializer
  attributes :id, :description, :enabled, :venue_name, :usages

  def venue_name
    object.venue.name
  end

  def usages
    VoucherUsage.where(voucher: object).size
  end
end
