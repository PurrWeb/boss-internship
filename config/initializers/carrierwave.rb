CarrierWave.configure do |config|
  if Rails.env.development? || Rails.env.test?
    config.storage = :file
  else
    config.storage = :fog

    config.fog_credentials = {
      provider:              "AWS",
      aws_access_key_id:     ENV.fetch("AWS_ACCESS_KEY_ID"),
      aws_secret_access_key: ENV.fetch("AWS_SECRET_ACCESS_KEY"),
      region:                ENV.fetch("S3_BACKUP_REGION")
    }

    config.fog_directory = ENV.fetch("S3_BACKUP_BUCKET")
    config.fog_public    = false
  end
end