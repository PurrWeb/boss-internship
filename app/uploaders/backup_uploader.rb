class BackupUploader < CarrierWave::Uploader::Base
  if BooleanEnvVariable.new("BACKUP_TO_S3").value
    storage :fog

    configure do |config|
      config.store_dir = ENV.fetch("S3_BACKUP_FOLDER")
      config.fog_directory = ENV.fetch("S3_BACKUP_BUCKET")
      config.fog_public    = false
    end
  end
end
