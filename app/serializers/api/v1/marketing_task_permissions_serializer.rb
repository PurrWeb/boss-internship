class Api::V1::MarketingTaskPermissionsSerializer < ActiveModel::Serializer
  attributes :user_id, :user_role, :access_level, :can_view_page, :can_create_tasks, :accessible_venue_ids

  def access_level
    object.access_level.access_level
  end

  def accessible_venue_ids
    object.accessible_venues.pluck(:id)
  end
end
