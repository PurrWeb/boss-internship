class UserAbility
  include CanCan::Ability

  def initialize(user)
    # Define abilities for the passed in user here. For example:
    #
    if user && user.enabled?
      if user.has_admin_access?
        can :manage, :admin
      end

      if user.dev?
        can :manage, :dev_only_pages
      end

      can :view, :maintenance_tasks do
        user.maintenance_staff? || !user.restricted_access?
      end

      can [:view, :add_note, :change_status], MaintenanceTask do |maintenance_task|
        user.maintenance_staff? || (
          !user.restricted_access? && can_manage_venue?(user, maintenance_task.venue)
        )
      end

      can :manage, MaintenanceTask do |maintenance_task|
        !user.restricted_access? && can_manage_venue?(user, maintenance_task.venue)
      end

      can :view, :venue_dashboard do
        !user.restricted_access?
      end

      can :manage, DashboardMessage do
        user.has_admin_access?
      end

      can :list, :staff_members do
        user.security_manager? || !user.restricted_access?
      end

      can :create, :staff_members do
        user.security_manager? || !user.restricted_access?
      end

      can :manage, :change_orders do
        !user.restricted_access?
      end

      can :manage, :check_lists do
        !user.restricted_access?
      end

      can :manage, :fruit_orders do
        !user.restricted_access?
      end

      can :manage, :vouchers do
        !user.restricted_access?
      end

      can :manage, :safe_checks do
        !user.restricted_access?
      end

      can :manage, :venue_health_checks do
        !user.restricted_access?
      end

      can :manage, :rotas do
        !user.restricted_access?
      end

      can :manage, :clock_in_clock_out do
        user.has_admin_access?
      end

      can :manage, :security_rota do
        user.security_manager? || user.has_admin_access?
      end

      can :manage, :incident_reports do
        !user.restricted_access?
      end

      can :view, :holidays do
        !user.restricted_access?
      end

      can :view, :holidays_csv do
        user.has_admin_access?
      end

      can :view, :payroll_reports do
        !user.restricted_access?
      end

      can :view, :daily_reports do
        !user.restricted_access?
      end

      can :view, :weekly_reports do
        !user.restricted_access?
      end

      can [:view], QuestionnaireResponse do |questionnaire_response|
        !user.restricted_access? && can_manage_venue?(user, questionnaire_response.venue)
      end

      can [:view, :create, :update, :destroy], Holiday do |holiday|
        !user.restricted_access? && can_edit_staff_member?(user, holiday.staff_member)
      end

      can :manage, IncidentReport do |incident_report|
        !user.restricted_access? && can_manage_venue?(user, incident_report.venue)
      end

      can :manage, Voucher do |voucher|
        !user.restricted_access? && can_manage_venue?(user, voucher.venue)
      end

      can :manage, OwedHour do |owed_hour|
        !user.restricted_access? || can_edit_staff_member?(user, owed_hour.staff_member)
      end

      can :manage, Venue do |venue|
        !user.restricted_access? && can_manage_venue?(user, venue)
      end

      can :enable, StaffMember do |staff_member|
        (user.security_manager? && staff_member.security?) || (
          !user.restricted_access? && (
            staff_member.disabled? && can_edit_staff_member?(user, staff_member)
          )
        )
      end

      can :disable, StaffMember do |staff_member|
        (user.security_manager? && staff_member.security?) || (
          !user.restricted_access? && (
            staff_member.enabled? &&
              user.staff_member != staff_member &&
              can_edit_staff_member?(user, staff_member)
          )
        )
      end

      can :edit, StaffMember do |staff_member|
        (user.security_manager? && staff_member.security?) || (
          !user.restricted_access? && can_edit_staff_member?(user, staff_member)
        )
      end

      can :manage, Rota do |rota|
        !user.restricted_access? && can_manage_venue?(user, rota.venue)
      end

      can :manage, RotaShift do |rota_shift|
        if rota_shift.security?
          user.has_admin_access? || user.security_manager?
        else
          !user.restricted_access? && can_manage_venue?(user, rota_shift.venue)
        end
      end

      can :create_staff_member, User do |target_user|
        !user.restricted_access? && (
          user.has_admin_access? || user == target_user
        )
      end

      can :disable, User do |target_user|
        !user.restricted_access? && (
          user.has_admin_access? &&
            target_user.enabled? &&
            user != target_user
        )
      end

      can :enable, User do |target_user|
        !user.restricted_access? && (
          user.has_admin_access? &&
            target_user.disabled? &&
            user != target_user
        )
      end

      can :update, ChangeOrder do |change_order|
        !user.restricted_access? && (
          can_update_change_order?(user, change_order)
        )
      end

      can :destroy, ChangeOrder do |change_order|
        !user.restricted_access? && (
          change_order.persisted? &&
            !(change_order.done? || change_order.deleted?) &&
            can_update_change_order?(user, change_order)
        )
      end

      can :update, FruitOrder do |fruit_order|
        !user.restricted_access? && (
          can_update_fruit_order?(user, fruit_order)
        )
      end

      can :view, :hours_confirmation_page do
        !user.restricted_access?
      end

      can :update, HoursAcceptancePeriod do |hours_acceptance_period|
        !user.restricted_access? && (
          can_manage_venue?(user, hours_acceptance_period.venue)
        )
      end

      can :manage, :machines do
        !user.restricted_access?
      end

      can :destroy, FruitOrder do |fruit_order|
        !user.restricted_access? && (
          fruit_order.persisted? &&
            !(fruit_order.done? || fruit_order.destroyed?) &&
            can_update_fruit_order?(user, fruit_order)
        )
      end

      can :perform_clocking_action, StaffMember do |staff_member|
        !user.restricted_access? && (
          can_edit_staff_member?(user, staff_member)
        )
      end
    end

    #
    # The first argument to `can` is the action you are giving the user
    # permission to do.
    # If you pass :manage it will apply to every action. Other common actions
    # here are :read, :create, :update and :destroy.
    #
    # The second argument is the resource the user can perform the action on.
    # If you pass :all it will apply to every resource. Otherwise pass a Ruby
    # class of the resource.
    #
    # The third argument is an optional hash of conditions to further filter the
    # objects.
    # For example, here the user can only update published articles.
    #
    #   can :update, Article, :published => true
    #
    # See the wiki for details:
    # https://github.com/ryanb/cancan/wiki/Defining-Abilities
  end

  def can_update_change_order?(user, change_order)
    if change_order.in_progress?
      can_manage_venue?(user, change_order.venue)
    else
      user.has_admin_access?
    end
  end

  def can_update_fruit_order?(user, fruit_order)
    if fruit_order.in_progress?
      can_manage_venue?(user, fruit_order.venue)
    else
      user.has_admin_access?
    end
  end

  def can_edit_staff_member?(user, staff_member)
    workable_venues = staff_member.workable_venues

    staff_member.security? ||
      workable_venues.length == 0 ||
      workable_venues.any? do |venue|
        can_manage_venue?(user, venue)
      end
  end

  def can_manage_venue?(user, venue)
    user.ops_manager? || user.has_admin_access? || user.venues.include?(venue)
  end
end
