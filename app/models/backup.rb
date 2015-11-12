class Backup < ActiveRecord::Base
  validates :size, presence: true
  validates :dump, presence: true

  mount_uploader :dump, BackupUploader
end
