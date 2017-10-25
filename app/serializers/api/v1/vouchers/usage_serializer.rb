class Api::V1::Vouchers::UsageSerializer < ActiveModel::Serializer
  attributes :id, :staff_member, :venue_name, :created_at, :enabled

  def created_at
    object.created_at.iso8601
  end

  def staff_member
    object.staff_member.name.full_name
  end

  def venue_name
    object.staff_member.master_venue.name
  end
end
