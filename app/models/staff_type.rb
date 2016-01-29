class StaffType < ActiveRecord::Base
  ROLES = ['normal', 'security']

  validates :name, presence: true, uniqueness: true
  validates :role, presence: true, inclusion: { in: ROLES, message: 'is required' }
end

