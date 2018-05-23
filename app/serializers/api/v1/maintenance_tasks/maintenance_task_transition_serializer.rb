class Api::V1::MaintenanceTasks::MaintenanceTaskTransitionSerializer < ActiveModel::Serializer
  attributes \
    :id,
    :toState,
    :createdAt,
    :requesterUser

  def toState
    object.to_state
  end

  def createdAt
    object.created_at
  end

  def requesterUser
    object.requester_user && Api::V1::MaintenanceTasks::UserSerializer.new(object.requester_user)
  end
end
