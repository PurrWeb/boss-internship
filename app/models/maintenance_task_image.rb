class MaintenanceTaskImage < ActiveRecord::Base
  # Associations
  belongs_to :maintenance_task

  # Plugins
  mount_uploader :file, ImageUploader

  # Validations
  validates :file, {
    file_size: { less_than: 1.megabyte }
  }
end
