module Permissions
  class MarketingTaskPermission
    include ActiveRecord::Serialization
    attr_reader :user

    RESOURCE = MarketingTask.new

    def initialize(user)
      @user = user
    end

    def user_role
      user.role
    end

    def access_level
      AccessLevel.area_manager_access_level
    end

    def can_view_page
      ability.can?(:view, :marketing_tasks_page)
    end

    def can_create_task
      ability.can?(:create, RESOURCE)
    end

    def can_view_task
      ability.can?(:view, RESOURCE)
    end

    def can_assign_task
      ability.can?(:assign, RESOURCE)
    end

    def can_update_status_task
      ability.can?(:update_status, RESOURCE)
    end

    def can_create_note_task
      ability.can?(:create_note, RESOURCE)
    end

    def can_update_task
      ability.can?(:update, RESOURCE)
    end

    def can_destroy_task
      ability.can?(:destroy, RESOURCE)
    end

    def can_restore_task
      ability.can?(:restore, RESOURCE)
    end

    private

    def ability
      @ability ||= UserAbility.new(user)
    end
  end
end