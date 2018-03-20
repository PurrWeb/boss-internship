class Api::V1::MarketingTaskTimelineSerializer < ActiveModel::Serializer
  attributes :id, :to_state, :created_at

  has_one :requester_user, serializer: Api::V1::UserSerializer

  def to_state
    if object.is_a?(MarketingTaskTransition)
      object.to_state
    else
      object.state
    end
  end

  def requester_user
    if object.is_a?(MarketingTaskTransition)
      object.requester_user
    else
      object.user
    end
  end
end
