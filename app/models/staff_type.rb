class StaffType < ActiveRecord::Base
  ROLES = ['normal', 'security']
  SECURITY_ROLE = 'security'
  PR_TYPE_NAME = 'Pr'
  MANAGER_TYPE_NAME = 'Manager'
  KITCHEN_TYPE_NAMES = ['Chef', "Kp"]

  validates :name, presence: true, uniqueness: true
  validates :role, presence: true, inclusion: { in: ROLES, message: 'is required' }

  def security?
    role == SECURITY_ROLE
  end

  def bar_supervisor?
    name == 'Bar Supervisor'
  end

  def general_manager?
    name == 'GM'
  end

  def manager?
    name == MANAGER_TYPE_NAME
  end

  def self.manager
    where(name: MANAGER_TYPE_NAME)
  end

  def self.pr
    where(name: PR_TYPE_NAME)
  end

  def self.not_pr
    where.not(name: PR_TYPE_NAME)
  end

  def self.kitchen
    where(name: KITCHEN_TYPE_NAMES)
  end

  def self.not_kitchen
    where.not(name: KITCHEN_TYPE_NAMES)
  end

  def self.security
    where(role: SECURITY_ROLE)
  end

  def self.not_security
    where.not(role: SECURITY_ROLE)
  end
end


