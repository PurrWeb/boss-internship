class Permissions::MarketingTaskPermissionsSerializer < ActiveModel::Serializer
  attributes :user_role, :access_level, :can_view_page, :can_create_tasks
end
