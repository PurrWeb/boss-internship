class StaffMemberAbility
  include CanCan::Ability

  def initialize(staff_member)
    staff_type = staff_member.staff_type

    if staff_type.security?
      can :access, :security_app
    end

    # Define abilities for the passed in user here. For example:
    #
    can :perform_clocking_action, StaffMember do |other_staff_member|
      has_manager_mode_access?(staff_member) ||
        staff_member == other_staff_member
    end

    can :change_pin, StaffMember do |other_staff_member|
      has_manager_mode_access?(staff_member)
    end

    can :add_note, StaffMember do |other_staff_member|
      has_manager_mode_access?(staff_member)
    end
  end

  def has_manager_mode_access?(staff_member)
    staff_member.manager? ||
      staff_member.bar_supervisor? ||
      staff_member.general_manager?
  end
end
