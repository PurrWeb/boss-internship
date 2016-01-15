# encoding: utf-8

class AvatarUploader < CarrierWave::Uploader::Base
  if Rails.env.staging? || Rails.env.production?
    configure do |config|
      config.fog_directory = ENV.fetch("S3_ASSETS_BUCKET")
      config.fog_public    = true
    end
  end

  include CarrierWave::RMagick

  # Override the directory where uploaded files will be stored.
  # This is a sensible default for uploaders that are meant to be mounted:
  def store_dir
    "uploads/#{model.class.to_s.underscore}/#{mounted_as}/#{model.id}"
  end

  # Provide a default URL as a default if there hasn't been a file uploaded:
  # def default_url
  #   ActionController::Base.helpers.asset_path("fallback/" + [version_name, "default.png"].compact.join('_'))
  # end

  process :convert => 'jpg'

  version :small do
    process :resize_to_fit => [100, 100]
  end

  version :medium do
    process :resize_to_fit => [150, 150]
  end

  version :large do
    process :resize_to_fit => [250, 250]
  end

  # Add a white list of extensions which are allowed to be uploaded.
  # For images you might use something like this:
  def extension_white_list
    %w(jpg jpeg gif png)
  end

  # Override the filename of the uploaded files:
  # Avoid using model.id or version_name here, see uploader/store.rb for details.
  def filename
    "avatar.jpg" if original_filename
  end
end