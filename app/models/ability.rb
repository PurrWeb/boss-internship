class Ability
  include CanCan::Ability

  def initialize(user)
    # Define abilities for the passed in user here. For example:
    #
    if user.enabled?
      if user.has_admin_access?
        can :manage, :admin
      end

      can :manage, :staff_members

      can :manage, :rotas do
        !user.security_manager?
      end

      can :manage, :security_rota do
        user.has_admin_access? || user.security_manager?
      end

      can :manage, Holiday do |holiday|
        holiday.editable? && can_edit_staff_member?(user, holiday.staff_member)
      end

      can :manage, Venue do |venue|
        can_manage_venue?(user, venue)
      end

      can :view, StaffMember do |staff_member|
        staff_member.security? || can_manage_venue?(user, staff_member.venue)
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
        target_user.enabled? && user != target_user
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

  def can_edit_staff_member?(user, staff_member)
    staff_member.security? ||
      staff_member.venue.nil? ||
      can_manage_venue?(user, staff_member.venue)
  end

  def can_manage_venue?(user, venue)
      user.has_all_venue_access? || user.venues.include?(venue)
  end
end
