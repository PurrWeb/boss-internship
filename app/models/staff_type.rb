class StaffType < ActiveRecord::Base
  ROLES = ['normal', 'security']

  validates :name, presence: true, uniqueness: true
  validates :role, presence: true, inclusion: { in: ROLES, message: 'is required' }

  def security?
    name == 'Security'
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
    where(name: 'Security')
  end

  def self.not_security
    where.not(name: 'Security')
  end
end


