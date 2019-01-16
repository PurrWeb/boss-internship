CarrierWave.configure do |config|
  config.storage = :fog

  config.fog_credentials = {
    provider: "AWS",
    aws_access_key_id: ENV.fetch("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key: ENV.fetch("AWS_SECRET_ACCESS_KEY"),
    region: ENV.fetch("S3_BACKUP_REGION"),
  }
end
