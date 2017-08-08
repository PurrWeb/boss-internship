class Api::V1::RotaOverviewSerializer < ActiveModel::Serializer
  attributes :rota, :staff_members, :rota_shifts, :staff_types

  def rota
    Api::V1::RotaSerializer.new(
      object
    ).serializable_hash
  end

  def staff_members
    staff_members = StaffMember.
      joins('INNER JOIN rota_shifts ON rota_shifts.staff_member_id = staff_members.id').
      where(
       rota_shifts: { rota_id: object.id, enabled: true }
      ).
      includes([:staff_type, :name, :master_venue, :work_venues])

    ActiveModel::Serializer::CollectionSerializer.new(
      staff_members,
      serializer: Api::V1::StaffMemberSerializer
    )
  end

  def rota_shifts
    rota_shifts = object.enabled_rota_shifts.includes([:staff_member, :rota])

    ActiveModel::Serializer::CollectionSerializer.new(
      rota_shifts,
      serializer: Api::V1::RotaShiftSerializer
    )
  end

  def staff_types
    staff_types = instance_options[:scope][:staff_types]

    ActiveModel::Serializer::CollectionSerializer.new(
      staff_types,
      serializer: Api::V1::StaffTypeSerializer
    )
  end
end
