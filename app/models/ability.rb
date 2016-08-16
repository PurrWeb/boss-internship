class Ability
  include CanCan::Ability

  def initialize(user)
    # Define abilities for the passed in user here. For example:
    #
    if user && user.enabled?
      if user.has_admin_access?
        can :manage, :admin
      end

      can :manage, :staff_members

      can :manage, :change_orders do
        !user.security_manager?
      end

      can :manage, :fruit_orders do
        !user.security_manager?
      end

      can :manage, :rotas do
        !user.security_manager?
      end

      can :manage, :clock_in_clock_out do
        user.has_admin_access?
      end

      can :manage, :security_rota do
        user.has_admin_access? || user.security_manager?
      end

      can :view, :holidays do
        !user.security_manager?
      end

      can :view, :holidays_csv do
        user.has_admin_access?
      end

      can :view, :weekly_reports do
        user.has_all_venue_access? || !user.security_manager?
      end

      can :view, :daily_reports do
        user.has_all_venue_access? || !user.security_manager?
      end

      can [:view, :create], Holiday do |holiday|
        can_edit_staff_member?(user, holiday.staff_member)
      end

      can [:update, :destroy], Holiday do |holiday|
        user.has_admin_access?
      end

      can :manage, OwedHour do |owed_hour|
        can_edit_staff_member?(user, owed_hour.staff_member)
      end

      can :manage, Venue do |venue|
        can_manage_venue?(user, venue)
      end

      can :view, StaffMember do |staff_member|
        staff_member.security? || StaffMemberWorkableVenuesQuery.new(staff_member: staff_member).all.any? do |venue|
          can_manage_venue?(user, venue)
        end
      end

      can :enable, StaffMember do |staff_member|
        staff_member.disabled? &&
          can_edit_staff_member?(user, staff_member)
      end

      can :disable, StaffMember do |staff_member|
        staff_member.enabled? &&
          user.staff_member != staff_member &&
          can_edit_staff_member?(user, staff_member)
      end

      can :edit, StaffMember do |staff_member|
        can_edit_staff_member?(user, staff_member)
      end

      can :manage, Rota do |rota|
        can_manage_venue?(user, rota.venue)
      end

      can :manage, RotaShift do |rota_shift|
        if rota_shift.security?
          user.has_admin_access? || user.security_manager?
        else
          can_manage_venue?(user, rota_shift.venue)
        end
      end

      can :create_staff_member, User do |target_user|
        user.has_admin_access? || user == target_user
      end

      can :disable, User do |target_user|
        user.has_admin_access? &&
          target_user.enabled? &&
          user != target_user
      end

      can :enable, User do |target_user|
        user.has_admin_access? &&
          target_user.disabled? &&
          user != target_user
      end

      can :update, ChangeOrder do |change_order|
        can_update_change_order?(user, change_order)
      end

      can :destroy, ChangeOrder do |change_order|
        change_order.persisted? &&
          !(change_order.done? || change_order.deleted?) &&
          can_update_change_order?(user, change_order)
      end

      can :update, FruitOrder do |fruit_order|
        can_update_fruit_order?(user, fruit_order)
      end

      can :update, HoursAcceptancePeriod do |hours_acceptance_period|
        can_manage_venue?(user, hours_acceptance_period.venue)
      end

      can :destroy, FruitOrder do |fruit_order|
        fruit_order.persisted? &&
          !(fruit_order.done? || fruit_order.destroyd?) &&
          can_update_fruit_order?(user, fruit_order)
      end

      can :perform_clocking_action, StaffMember do |staff_member|
        can_edit_staff_member?(user, staff_member)
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
    workable_venues = StaffMemberWorkableVenuesQuery.new(staff_member: staff_member).all

    staff_member.security? ||
      workable_venues.length == 0 ||
      workable_venues.any? do |venue|
        can_manage_venue?(user, venue)
      end
  end

  def can_manage_venue?(user, venue)
    user.has_all_venue_access? || user.venues.include?(venue)
  end
end
