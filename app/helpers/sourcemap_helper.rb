require "digest"

module SourcemapHelper
  extend self

  def sourcemap_version
    Digest::SHA256.hexdigest File.read("#{Rails.root}/app/assets/javascripts/bundles/frontend_bundle.js.map")
  end
end
