# The webpack must compile assets before assets:environment task.
# Otherwise Sprockets sees no changes and doesn't precompile assets.
Rake::Task['assets:precompile']
  .clear_prerequisites
  .enhance(['assets:compile_environment'])

# Remove Webpack assets as well
Rake::Task['assets:clobber'].enhance do
  Rake::Task['assets:clobber_webpack'].invoke
end

namespace :assets do
  #In this task, set prerequisites for the assets:precompile task
  task :compile_environment => :webpack do
    Rake::Task['assets:environment'].invoke
  end

  desc 'Compile Webpack assets'
  task :webpack do
    sh "NODE_ENV=#{normalised_node_env} npm run build" # this runs a react_webpack_rails script
  end

  desc 'Remove compiled Webpack assets'
  task :clobber_webpack do
    rm_rf "#{Rails.application.config.root}/app/assets/javascripts/bundles/frontend_bundle.js"
    rm_rf "#{Rails.application.config.root}/app/assets/stylesheets/frontend_bundle.css"
  end

  def normalised_node_env
    case Rails.env
    when 'staging'
      'production'
    else
      Rails.env
    end
  end
end
