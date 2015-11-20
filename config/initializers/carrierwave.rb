CarrierWave.configure do |config|
  config.fog_credentials = {
    provider:              "AWS",
    aws_access_key_id:     "AKIAJ5R2N4NYRNBH4CKA",
    aws_secret_access_key: "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",
    region:                ENV.fetch("S3_BACKUP_REGION")
  }

  config.fog_directory = ENV.fetch("S3_BACKUP_BUCKET")
  config.fog_public    = false
end
