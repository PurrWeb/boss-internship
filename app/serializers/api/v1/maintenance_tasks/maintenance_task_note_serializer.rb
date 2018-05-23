class Api::V1::MaintenanceTasks::MaintenanceTaskNoteSerializer < ActiveModel::Serializer
  attributes \
    :id,
    :note,
    :createdAt,
    :updatedAt,
    :maintenanceTaskId,
    :disabledByUser,
    :creatorUser

  def createdAt
    object.created_at
  end

  def updatedAt
    object.updated_at
  end

  def maintenanceTaskId
    object.maintenance_task_id
  end

  def disabledByUser
    object.disabled_by_user && Api::V1::MaintenanceTasks::UserSerializer.new(object.disabled_by_user)
  end

  def creatorUser
    object.creator_user && Api::V1::MaintenanceTasks::UserSerializer.new(object.creator_user)
  end
end
