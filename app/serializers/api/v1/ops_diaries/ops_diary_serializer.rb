class Api::V1::OpsDiaries::OpsDiarySerializer < ActiveModel::Serializer
  attributes \
    :id,
    :title,
    :text,
    :venueId,
    :priority,
    :active,
    :createdAt,
    :createdByUserId

  def createdAt
    object.created_at.utc
  end

  def active
    object.enabled?
  end

  def venueId
    object.venue_id
  end

  def createdByUserId
    object.created_by_user_id
  end
end
