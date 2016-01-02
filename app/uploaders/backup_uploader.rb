class BackupUploader < CarrierWave::Uploader::Base
  if Rails.env.staging? || Rails.env.production?
    storage :fog

    configure do |config|
      config.store_dir = ENV.fetch("S3_BACKUP_FOLDER")
      config.fog_directory = ENV.fetch("S3_BACKUP_BUCKET")
      config.fog_public    = false
    end
  end
end
