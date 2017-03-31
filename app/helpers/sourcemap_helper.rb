module SourcemapHelper
  extend self

  def sourcemap_version
    json = get_bundle_assets
    json['metadata']['version']
  end

  def script_path
    json = get_bundle_assets
    json['main']['js']
  end

  def sourcemap_path
    script_path + '.map'
  end

  private
  def get_bundle_assets
    path = Rails.root.join('webpack-assets.json')
    file = File.read(path)
    JSON.parse(file)
  end
end
