class Ability
  include CanCan::Ability

  def initialize(user)
    # Define abilities for the passed in user here. For example:
    #
    if user.dev?
      can :manage, :all
    end

    if user.admin?
      can :manage, :admin
    end

    can :manage, :rotas

    can :manage, Venue do |venue|
      user.admin? || user.venues.include?(venue)
    end

    can :manage, StaffMember do |staff_member|
      user.admin? || user.venues.include?(staff_member.venue)
    end

    can :manage, Rota do |rota|
      user.admin? || user.venues.include?(rota.venue)
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
end
