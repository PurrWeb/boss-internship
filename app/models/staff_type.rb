class StaffType < ActiveRecord::Base
  ROLES = ['normal', 'security']
  SECURITY_ROLE = 'security'
  PR_TYPE_NAME = 'Pr'
  MANAGER_TYPE_NAME = 'Manager'
  KITCHEN_TYPE_NAMES = ['Chef', "Kp"]
  VALID_COLORS = ['F0AF85', 'C1C1C1', '84BEF0', '74DC61', 'F3A84D', 'DB8EF8', '86A9DF', 'EC6A6A', 'A9815D', '84DAF1', 'D2D540', '1F1F1F']

  has_many :staff_members

  validates :name, presence: true, uniqueness: true
  validates :role, presence: true, inclusion: { in: ROLES, message: 'is required' }
  validates :ui_color, presence: true, inclusion: { in: VALID_COLORS, message: 'must be valid' }

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


