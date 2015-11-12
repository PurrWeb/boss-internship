class BackupUploader < CarrierWave::Uploader::Base
  configure do |config|
    config.store_dir = Rails.env.to_s
  end

  storage :fog
end
