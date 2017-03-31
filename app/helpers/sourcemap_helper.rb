module SourcemapHelper
  extend self

  def sourcemap_version
    SecureRandom.urlsafe_base64(nil, false)
  end

  def script_path
    path = Rails.root.join('webpack-assets.json')
    file = File.read(path)
    json = JSON.parse(file)
    json['main']['js']
  end

  def sourcemap_path
    script_path + '.map'
  end
end
