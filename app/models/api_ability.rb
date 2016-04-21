class ApiAbility
  include CanCan::Ability

  def initialize(staff_member)
    # Define abilities for the passed in user here. For example:
    #
    can :perform_clocking_action, StaffMember do |other_staff_member|
      staff_member.manager? ||
        staff_member.bar_supervisor? ||
        staff_member == other_staff_member
    end
  end
end
