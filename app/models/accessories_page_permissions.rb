class AccessoriesPagePermissions
  def initialize(current_user:)
    @user_ability = UserAbility.new(current_user)
  end

  attr_reader :user_ability

  def permissions
    {
      create: user_ability.can?(:create, :accessory),
      edit: user_ability.can?(:edit, :accessory),
      disable: user_ability.can?(:destroy, :accessory),
      enable: user_ability.can?(:enable, :accessory),
      inventory: user_ability.can?(:accessory_inventory, :accessory),
    }
  end
end
