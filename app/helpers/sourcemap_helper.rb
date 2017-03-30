require "digest"

module SourcemapHelper
  extend self

  def sourcemap_version
    SecureRandom.urlsafe_base64(nil, false)
  end
end
