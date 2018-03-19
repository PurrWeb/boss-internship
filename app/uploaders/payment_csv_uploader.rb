# encoding: utf-8
class PaymentCsvUploader < CarrierWave::Uploader::Base
  # Add a white list of extensions which are allowed to be uploaded.
  # For images you might use something like this:
  def extension_white_list
    %w(csv)
  end

  # Override the directory where uploaded files will be stored.
  # This is a sensible default for uploaders that are meant to be mounted:
  def store_dir
    "uploads/#{model.class.to_s.underscore}/#{mounted_as}/#{model.id}"
  end

  if Rails.env.staging? || Rails.env.production?
    storage :fog

    configure do |config|
      config.store_dir = ENV.fetch("S3_CSV_UPLOAD_FOLDER")
      config.fog_directory = ENV.fetch("S3_ASSETS_BUCKET")
      config.fog_public = false
    end
  end
end
