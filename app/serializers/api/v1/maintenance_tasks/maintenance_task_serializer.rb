class Api::V1::MaintenanceTasks::MaintenanceTaskSerializer < ActiveModel::Serializer
  attributes \
    :id,
    :title,
    :description,
    :priority,
    :disabledAt,
    :createdAt,
    :updatedAt,
    :status,
    :allowedTransitions,
    :disabledByUser,
    :creatorUser,
    :maintenanceTaskImages,
    :maintenanceTaskNotes,
    :maintenanceTaskTransitions

  has_one :venue, serializer: Api::V1::MaintenanceTasks::VenueSerializer

  def maintenanceTaskImages
    ActiveModel::Serializer::CollectionSerializer.new(
      object.maintenance_task_images,
      serializer: Api::V1::MaintenanceTasks::UploadSerializer
    )
  end

  def maintenanceTaskTransitions
    ActiveModel::Serializer::CollectionSerializer.new(
      object.maintenance_task_transitions,
      serializer: Api::V1::MaintenanceTasks::MaintenanceTaskTransitionSerializer
    )
  end

  def maintenanceTaskNotes
    ActiveModel::Serializer::CollectionSerializer.new(
      object.maintenance_task_notes,
      serializer: Api::V1::MaintenanceTasks::MaintenanceTaskNoteSerializer
    )
  end

  def status
    object.state_machine.current_state
  end

  def disabledAt
    object.disabled_at
  end

  def createdAt
    object.created_at
  end

  def updatedAt
    object.updated_at
  end

  def allowedTransitions
    if scope[:current_user].maintenance_staff?
      if ['completed', 'accepted'].include?(object.state_machine.current_state)
        return []
      end
    end

    object.state_machine.allowed_transitions
  end

  def disabledByUser
    object.disabled_by_user && Api::V1::MaintenanceTasks::UserSerializer.new(object.disabled_by_user)
  end

  def creatorUser
    object.creator_user && Api::V1::MaintenanceTasks::UserSerializer.new(object.creator_user)
  end

end
