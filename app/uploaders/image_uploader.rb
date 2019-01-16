class ImageUploader < CarrierWave::Uploader::Base
  include CarrierWave::RMagick

  configure do |config|
    config.fog_directory = ENV.fetch("S3_ASSETS_BUCKET")
    config.fog_public = true
  end

  process :convert => "jpg"

  version :small do
    process :resize_to_fit => [250, 250]
  end

  version :medium do
    process :resize_to_fit => [500, 500]
  end

  version :large do
    process :resize_to_fit => [800, 800]
  end

  # Add a white list of extensions which are allowed to be uploaded.
  # For images you might use something like this:
  def extension_white_list
    %w(jpg jpeg gif png)
  end

  # Override the filename of the uploaded files:
  # Avoid using model.id or version_name here, see uploader/store.rb for details.
  def filename
    "#{secure_token}.jpg" if original_filename.present?
  end

  protected

  def secure_token
    var = :"@#{mounted_as}_secure_token"

    model.instance_variable_get(var) || model.instance_variable_set(var, SecureRandom.uuid)
  end
end
