class Upload < ActiveRecord::Base
  # Associations
  belongs_to :imageable, polymorphic: true

  # Plugins
  mount_uploader :file, FileUploader

  # Validations
  validates :file, {
    file_size: { less_than: 1.megabyte }
  }
end
