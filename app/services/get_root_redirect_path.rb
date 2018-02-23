class GetRootRedirectPath
  def initialize(user:, url_helpers: Rails.application.routes.url_helpers)
    @user = user
    @url_helpers = url_helpers
  end
  attr_reader :user, :url_helpers

  def call
    if user.has_effective_access_level?(AccessLevel.manager_access_level)
      url_helpers.venue_dashboard_path(venue_id: user.default_venue)
    elsif user.maintenance_staff?
      url_helpers.maintenance_index_path
    elsif user.security_manager?
      url_helpers.security_rotas_path
    elsif user.payroll_manager?
      url_helpers.staff_members_path
    elsif user.food_ops_manager?
      url_helpers.staff_members_path
    elsif user.marketing_staff?
      url_helpers.marketing_tasks_path
    else
      raise "unsuppored user role #{user.role} encountered"
    end
  end
end
