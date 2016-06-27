class StaffType < ActiveRecord::Base
  ROLES = ['normal', 'security']

  validates :name, presence: true, uniqueness: true
  validates :role, presence: true, inclusion: { in: ROLES, message: 'is required' }

  def security?
    role == 'security'
  end

  def bar_supervisor?
    name == 'Bar Supervisor'
  end

  def general_manager?
    name == 'GM'
  end

  def manager?
    name == 'Manager'
  end

  def self.pr
    where(name: 'Pr')
  end

  def self.not_pr
    where.not(name: 'Pr')
  end

  def self.kitchen
    where(name: ['Chef', "Kp"])
  end

  def self.not_kitchen
    where.not(name: ['Chef', "Kp"])
  end

  def self.security
    where(role: 'security')
  end

  def self.not_security
    where.not(role: 'security')
  end
end


