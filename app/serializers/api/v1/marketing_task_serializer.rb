class Api::V1::MarketingTaskSerializer < ActiveModel::Serializer
  attributes :id, :title, :type, :description, :due_at, :past_due, :disabled_at,
    :created_at, :updated_at, :status, :allowed_transitions, :days, :facebook_announcement,
    :start_time, :size, :height_cm, :width_cm, :facebook_cover_page, :facebook_booster,
    :facebook_announcement, :print, :completed_at, :quantity

  has_one :venue, serializer: Api::V1::VenueSerializer
  has_one :created_by_user, serializer: Api::V1::UserSerializer
  has_one :completed_by_user, serializer: Api::V1::UserSerializer
  has_one :disabled_by_user, serializer: Api::V1::UserSerializer
  has_one :assigned_to_user, serializer: Api::V1::UserSerializer
  has_many :marketing_task_notes, serializer: Api::V1::MarketingTaskNoteSerializer
  has_many :marketing_task_transitions, serializer: Api::V1::MarketingTaskTransitionSerializer

  def status
    object.state_machine.current_state
  end

  def allowed_transitions
    object.state_machine.allowed_transitions
  end

  def past_due
    object.due_at < Time.current
  end
end
