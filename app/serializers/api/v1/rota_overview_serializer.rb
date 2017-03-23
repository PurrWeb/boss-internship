class Api::V1::RotaOverviewSerializer < ActiveModel::Serializer
  attributes :rota, :staff_members, :rota_shifts, :staff_types

  def rota
    Api::V1::RotaSerializer.new(
      object
    ).serializable_hash
  end

  def staff_members
    staff_members = StaffMember.where(
      id: object.rota_shifts.enabled.map(&:staff_member_id)
    ).includes([:master_venue, :staff_type, :name, :work_venues])

    ActiveModel::Serializer::CollectionSerializer.new(
      staff_members,
      serializer: Api::V1::StaffMemberSerializer
    )
  end

  def rota_shifts
    rota_shifts = object.rota_shifts.enabled.includes(:staff_member)

    ActiveModel::Serializer::CollectionSerializer.new(
      rota_shifts,
      serializer: Api::V1::RotaShiftSerializer
    )
  end

  def staff_types
    staff_types = instance_options[:scopes][:staff_types]

    ActiveModel::Serializer::CollectionSerializer.new(
      staff_types,
      serializer: Api::V1::StaffTypeSerializer
    )
  end
end
