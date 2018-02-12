class Api::V1::MarketingTaskNoteSerializer < ActiveModel::Serializer
  attributes :id, :note, :created_at, :updated_at, :marketing_task_id

  has_one :disabled_by_user, serializer: Api::V1::UserSerializer
  has_one :creator_user, serializer: Api::V1::UserSerializer, include: true
end
