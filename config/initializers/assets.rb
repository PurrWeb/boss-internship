# Be sure to restart your server when you modify this file.

# Version of your assets, change this if you want to expire all your assets.
Rails.application.config.assets.version = '1.0'

# Add additional assets to the asset load path
# Rails.application.config.assets.paths << Emoji.images_path

# Precompile additional assets.
# application.js, application.css, and all non-JS/CSS in app/assets folder are already added.
Rails.application.config.assets.precompile += %w( d3.completeness-chart.js d3.score-chart.js d3.failures-chart.js )

# Include the SourcemapHelper in the asset context class so we can generate
# the sourcemap version in rollbar.js.erb
Rails.application.config.assets.configure do |env|
  env.context_class.class_eval do
    include SourcemapHelper
  end
end
