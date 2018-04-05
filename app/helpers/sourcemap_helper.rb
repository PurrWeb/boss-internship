module SourcemapHelper
  BUNDLE_NAMES = ["vendors", "assets", "main", "runtime"]
  extend self

  def sourcemap_version
    json = get_bundle_assets
    json.fetch('metadata').fetch('version')
  end

  def bundles
    json = get_bundle_assets
    BUNDLE_NAMES.map do |bundle_name|
      bundle_path = json.fetch(bundle_name).fetch('js')
      sourcemap_path = bundle_path + '.map'
      {
        name: bundle_name,
        bundle_path: bundle_path,
        sourcemap_path: sourcemap_path
      }
    end
  end

  private
  def get_bundle_assets
    path = Rails.root.join('webpack-assets.json')
    file = File.read(path)
    JSON.parse(file)
  end
end
