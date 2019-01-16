# The webpack must compile assets before assets:environment task.
# Otherwise Sprockets sees no changes and doesn't precompile assets.
Rake::Task['assets:precompile']

namespace :assets do
  desc 'Generate Webpack assets'
  task :webpack => :environment do
    build_webpack
  end

  desc "Upload Sourcemaps"
  task :upload_sourcemaps => :environment do
    bundles = SourcemapHelper.bundles
    bundle_count = bundles.count

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
      bundles.each_with_index do |bundle, index|
        upload_url = "#{host}#{bundle.fetch(:bundle_path)}"

        upload_command_parts = ["curl https://api.rollbar.com/api/1/sourcemap"]
        upload_command_parts << %{-F access_token="#{ENV.fetch("ROLLBAR_POST_SERVER_ITEM_ACCESS_TOKEN")}"}
        upload_command_parts << %{-F version="#{SourcemapHelper.sourcemap_version}"}
        upload_command_parts << %{-F minified_url="#{upload_url}"}
        upload_command_parts << %{-F source_map="@#{Rails.application.config.root}/public#{bundle.fetch(:sourcemap_path)}"}
        upload_command = upload_command_parts.join(" ")

        puts
        puts "Uploading bundle #{index + 1 } of #{bundle_count}"
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
    if normalised_node_env == 'production'
      sh "NODE_ENV=#{normalised_node_env} yarn run build:production"
    else
      sh "NODE_ENV=#{normalised_node_env} yarn run build" # this runs a react_webpack_rails script
    end
  end
end
