class Api::V1::MaintenanceTaskTransitionSerializer < ActiveModel::Serializer
  attributes :id, :to_state, :created_at

  has_one :requester_user, serializer: Api::V1::UserSerializer
end
