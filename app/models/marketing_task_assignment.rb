class MarketingTaskAssignment < ActiveRecord::Base
  # Constants
  ASSIGNED = 'assigned'.freeze
  UNASSIGNED = 'unassigned'.freeze

  # Associations
  belongs_to :marketing_task
  belongs_to :user

  # Validations
  validates :state, :user, :marketing_task, presence: true
  validates :state, inclusion: { in: [ASSIGNED, UNASSIGNED] }
end
