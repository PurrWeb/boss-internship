class StaffMemberProfilePermissions
  def initialize(current_user:, staff_member:)
    @user_ability = UserAbility.new(current_user)
    @staff_member = staff_member
  end
  attr_reader :user_ability, :staff_member

  def can_enable?
    user_ability.can?(:enable, staff_member)
  end
end
