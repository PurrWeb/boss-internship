CarrierWave.configure do |config|
  config.fog_credentials = {
    provider:              "AWS",
    aws_access_key_id:     "AKIAJ5R2N4NYRNBH4CKA",
    aws_secret_access_key: "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",
    region:                "eu-west-1"
  }

  config.fog_directory = "jsmbars-backup-boss"
  config.fog_public    = false
end
