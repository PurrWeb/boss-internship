class StaffMemberAbility
  include CanCan::Ability

  def initialize(staff_member)
    can :access, MobileApp do |mobile_app|
      staff_member.verified? && (
        if mobile_app.security_app?
          staff_member.staff_type.security?
        elsif mobile_app.clocking_app?
          true
        else
          raise "attempt to check access to unsupported app #{mobile_app.name}"
        end
      )
    end

    # Define abilities for the passed in user here. For example:
    #
    can :perform_clocking_action, StaffMember do |other_staff_member|
      has_manager_mode_access?(staff_member) ||
        staff_member == other_staff_member
    end

    can :change, :pin_code do
      has_manager_mode_access?(staff_member)
    end

    can [:add, :edit, :delete], :note do
      has_manager_mode_access?(staff_member)
    end
  end

  def has_manager_mode_access?(staff_member)
    staff_member.manager? ||
      staff_member.bar_supervisor? ||
      staff_member.general_manager?
  end
end
