class BackupUploader < CarrierWave::Uploader::Base
  configure do |config|
    config.store_dir = ENV.fetch("S3_BACKUP_FOLDER")
  end

  storage :fog
end
