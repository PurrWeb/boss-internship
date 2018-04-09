class Api::V1::MaintenanceTaskSerializer < ActiveModel::Serializer
  attributes :id, :title, :description, :priority, :disabled_at, :created_at, :updated_at, :status, :allowed_transitions

  has_one :venue, serializer: Api::V1::VenueSerializer
  has_one :creator_user, serializer: Api::V1::UserSerializer
  has_one :disabled_by_user, serializer: Api::V1::UserSerializer
  has_many :maintenance_task_images, serializer: Api::V1::UploadSerializer
  has_many :maintenance_task_notes, serializer: Api::V1::MaintenanceTaskNoteSerializer
  has_many :maintenance_task_transitions, serializer: Api::V1::MaintenanceTaskTransitionSerializer

  def status
    object.state_machine.current_state
  end

  def allowed_transitions
    if scope[:current_user].maintenance_staff?
      if ['completed', 'accepted'].include?(object.state_machine.current_state)
        return []
      end
    end

    object.state_machine.allowed_transitions
  end
end
