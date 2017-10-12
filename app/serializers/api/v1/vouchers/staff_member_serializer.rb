class Api::V1::Vouchers::StaffMemberSerializer < ActiveModel::Serializer
  attributes :id, :full_name, :venue_name

  def full_name
    object.name.full_name
  end

  def venue_name
    object.master_venue.name
  end
end
