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
    bundle_path = "/assets/bundles/frontend_bundle.js"

    upload_hosts = []
    if Rails.env.staging?
      upload_hosts << 'https://dev-boss.jsmbars.co.uk'
      upload_hosts << 'https://staging-boss.jsmbars.co.uk'
      upload_hosts << 'https://staging-clock.jsmbars.co.uk'
    elsif Rails.env.production?
      upload_hosts << 'https://boss.jsmbars.co.uk'
      upload_hosts << 'https://clock.jsmbars.co.uk'
    end

    upload_hosts.each do |host|
      upload_url = "#{host}#{bundle_path}"

      upload_command_parts = ["curl https://api.rollbar.com/api/1/sourcemap"]
      upload_command_parts << %{-F access_token="#{ENV.fetch("ROLLBAR_POST_SERVER_ITEM_ACCESS_TOKEN")}"}
      upload_command_parts << %{-F version="#{SourcemapHelper.sourcemap_version}"}
      upload_command_parts << %{-F minified_url="#{upload_url}"}
      upload_command_parts << %{-F source_map="@#{Rails.application.config.root}/public/assets/bundles/frontend_bundle.js.map"}
      upload_command = upload_command_parts.join(" ")

      puts
      puts 'Running file upload command'
      puts upload_command
      puts
      response = `#{upload_command}`
      json_result = JSON.parse(response)
      if json_result["err"] > 0
        puts "Sourcemap Upload Failed"
        puts json_result
        raise json_result.to_s
      end
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
