class Api::V1::StaffMemberProfile::AccessoryRequestSerializer < ActiveModel::Serializer
  attributes \
    :id,
    :createdAt,
    :status,
    :accessoryName,
    :size

  def createdAt
    object.state_machine.last_transition.created_at.utc
  end

  def status
    object.current_state
  end

  def accessoryName
    object.accessory.name
  end
end
