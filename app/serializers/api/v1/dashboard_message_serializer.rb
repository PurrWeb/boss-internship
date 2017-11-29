class Api::V1::DashboardMessageSerializer < ActiveModel::Serializer
  attributes :id, :title, :message, :to_all_venues, :published_time, :status, :created_by_user_name, :venue_ids, :created_at

  def created_by_user_name
    object.created_by_user.name.full_name
  end
end
