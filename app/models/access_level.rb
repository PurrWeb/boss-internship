class AccessLevel
  DEV_ACCESS_LEVEL = 'dev'
  ADMIN_ACCESS_LEVEL = 'admin'
  AREA_MANAGER_ACCESS_LEVEL = 'area_manager'
  MANAGER_ACCESS_LEVEL = 'manager'
  RESTRICTED_ACCESS_LEVEL = 'restricted'
  LEVEL_DATA = {
    DEV_ACCESS_LEVEL => 4,
    ADMIN_ACCESS_LEVEL => 3,
    AREA_MANAGER_ACCESS_LEVEL => 2,
    MANAGER_ACCESS_LEVEL => 1,
    RESTRICTED_ACCESS_LEVEL => 0
  }

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
    when User::DEV_ROLE
      DEV_ACCESS_LEVEL
    when User::ADMIN_ROLE
      ADMIN_ACCESS_LEVEL
    when User::OPS_MANAGER_ROLE
      AREA_MANAGER_ACCESS_LEVEL
    when User::MANAGER_ROLE
      MANAGER_ACCESS_LEVEL
    when User::MAINTENANCE_ROLE, User::MARKETING_ROLE, User::SECURITY_MANAGER_ROLE
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
