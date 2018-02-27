module Permissions
  class MarketingTaskPermissions
    include ActiveRecord::Serialization
    attr_reader :user

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

    def can_create_tasks
      ability.can?(:create, :marketing_tasks)
    end

    private

    def ability
      @ability ||= UserAbility.new(user)
    end
  end
end
