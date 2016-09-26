require "digest"

module SourcemapHelper
  extend self

  def sourcemap_version
    Rails.application.assets['bundles/frontend_bundle.js'].digest
  end
end
