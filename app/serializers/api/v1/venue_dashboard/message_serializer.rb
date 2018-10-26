class Api::V1::VenueDashboard::MessageSerializer < ActiveModel::Serializer
  attributes \
    :id,
    :title,
    :message,
    :toAllVenues,
    :publishedTime,
    :status,
    :createdByUserName,
    :venueIds,
    :createdAt

  def toAllVenues
    object.to_all_venues
  end

  def publishedTime
    object.published_time
  end

  def createdByUserName
    object.created_by_user.name.full_name
  end

  def venueIds
    object.venue_ids
  end

  def createdAt
    object.created_at
  end
end
