class MaintenanceTaskNote < ActiveRecord::Base
  include Noteable

  # Associations
  belongs_to :maintenance_task

  # Validations
  validates :maintenance_task, presence: true
end
