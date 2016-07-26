# The webpack must compile assets before assets:environment task.
# Otherwise Sprockets sees no changes and doesn't precompile assets.
Rake::Task['assets:precompile'].
  enhance(['assets:webpack'])

namespace :assets do
  desc 'Generate Webpack assets'
  task :webpack => :environment do
    clobber_webpack_assets
    build_webpack
  end

  desc "Upload Sourcemaps"
  task :upload_sourcemaps => :environment do
    bundle_url = ActionController::Base.helpers.asset_url('bundles/frontend_bundle.js')

    upload_command = ["curl https://api.rollbar.com/api/1/sourcemap"]
    upload_command << "-F access_token=#{ENV.fetch("ROLLBAR_POST_SERVER_ITEM_ACCESS_TOKEN")}"
    # Supplied by dokku dokku-git-rev plugin
    upload_command << "-F version=#{ENV.fetch("GIT_REV")}"
    upload_command << "-F minified_url=#{bundle_url}"
    upload_command << "-F source_map=@#{Rails.application.config.root}/app/assets/javascripts/bundles/frontend_bundle.js.map"
    response = `#{upload_command.join(' ')}`
    json_result = JSON.parse(response)
    if json_result["err"] > 0
      puts "Sourcemap Upload Failed"
      puts json_result
      raise json_result.to_s
    end
  end

  def normalised_node_env
    case Rails.env
    when 'staging'
      'production'
    else
      Rails.env
    end
  end

  def build_webpack
    sh "NODE_ENV=#{normalised_node_env} npm run build" # this runs a react_webpack_rails script
  end

  def clobber_webpack_assets
    rm_rf "#{Rails.application.config.root}/app/assets/javascripts/bundles/frontend_bundle.js"
    rm_rf "#{Rails.application.config.root}/app/assets/javascripts/bundles/frontend_bundle.js.map"
    rm_rf "#{Rails.application.config.root}/app/assets/stylesheets/frontend_bundle.css"
  end
end
