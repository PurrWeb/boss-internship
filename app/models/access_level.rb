class AccessLevel
  # These values must be mirrored in js user-permissions
  DEV_ACCESS_LEVEL = 'dev'
  ADMIN_ACCESS_LEVEL = 'admin'
  AREA_MANAGER_ACCESS_LEVEL = 'area_manager'
  MANAGER_ACCESS_LEVEL = 'manager'
  RESTRICTED_ACCESS_LEVEL = 'restricted'
  # These values must be mirrored in js user-permissions
  LEVEL_DATA = {
    DEV_ACCESS_LEVEL => 4,
    ADMIN_ACCESS_LEVEL => 3,
    AREA_MANAGER_ACCESS_LEVEL => 2,
    MANAGER_ACCESS_LEVEL => 1,
    RESTRICTED_ACCESS_LEVEL => 0
  }

  DEV_ACCESS_ROLES = [User::DEV_ROLE]
  ADMIN_ACCESS_ROLES = [User::ADMIN_ROLE]
  AREA_MANAGER_ACCESS_ROLES = [User::AREA_MANAGER_ROLE]
  MANAGER_ACCESS_ROLES = [
    User::MANAGER_ROLE,
    User::OPS_MANAGER_ROLE
  ]
  RESTRICTED_ACCESS_ROLES = [
    User::MAINTENANCE_ROLE,
    User::MARKETING_ROLE,
    User::SECURITY_MANAGER_ROLE,
    User::PAYROLL_MANAGER,
    User::FOOD_OPS_MANAGER
  ]

  def initialize(access_level)
    raise "Unsupported access level #{access_level} encounted" unless LEVEL_DATA.keys.include?(access_level)
    @access_level = access_level
  end
  attr_reader :access_level

  def is_effectively?(target_access_level)
    value >= target_access_level.value
  end

  def value
    LEVEL_DATA.fetch(access_level) do
      raise "unsupported access level #{access_level} encountered"
    end
  end

  def self.for_user_role(role)

    access_level = case role
    when *DEV_ACCESS_ROLES
      DEV_ACCESS_LEVEL
    when *ADMIN_ACCESS_ROLES
      ADMIN_ACCESS_LEVEL
    when *AREA_MANAGER_ACCESS_ROLES
      AREA_MANAGER_ACCESS_LEVEL
    when *MANAGER_ACCESS_ROLES
      MANAGER_ACCESS_LEVEL
    when *RESTRICTED_ACCESS_ROLES
      RESTRICTED_ACCESS_LEVEL
    else
      raise "Unsupported role '#{role}' encountered"
    end

    AccessLevel.new(access_level)
  end

  def self.dev_access_level
    AccessLevel.new(DEV_ACCESS_LEVEL)
  end

  def self.admin_access_level
    AccessLevel.new(ADMIN_ACCESS_LEVEL)
  end

  def self.area_manager_access_level
    AccessLevel.new(AREA_MANAGER_ACCESS_LEVEL)
  end

  def self.manager_access_level
    AccessLevel.new(MANAGER_ACCESS_LEVEL)
  end

  def self.restricted_access_level
    AccessLevel.new(RESTRICTED_ACCESS_LEVEL)
  end
end
