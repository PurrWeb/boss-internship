class Permissions::MarketingTaskPermissionSerializer < ActiveModel::Serializer
  attributes :user_role, :access_level, :can_view_page, :can_create_task, :can_view_task, :can_assign_task,
    :can_update_status_task, :can_create_note_task, :can_update_task, :can_destroy_task,
    :can_restore_task
end
