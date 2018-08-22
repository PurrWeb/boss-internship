require File.expand_path('../boot', __FILE__)

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Boss
  class Application < Rails::Application
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    # Set Time.zone default to the specified zone and make Active Record auto-convert to this zone.
    # Run "rake -D time" for a list of tasks for finding time zone names. Default is UTC.
    config.time_zone = 'London'

    # The default locale is :en and all translations from config/locales/*.rb,yml are auto loaded.
    # config.i18n.load_path += Dir[Rails.root.join('my', 'locales', '*.{rb,yml}').to_s]
    # config.i18n.default_locale = :de

    config.autoload_paths += Dir["#{config.root}/app/services/**/"]
    config.autoload_paths += Dir["#{config.root}/app/serializers/**/"]
    config.autoload_paths += Dir["#{config.root}/app/page_data/**/"]
    config.autoload_paths += Dir["#{config.root}/app/reports/**/"]
    config.autoload_paths += Dir["#{config.root}/app/models/test_data/**/"]
    config.autoload_paths += Dir["#{config.root}/app/models/pdf/**/"]
    config.autoload_paths += Dir["#{config.root}/app/assets/fonts/**/"]

    config.assets.precompile += %w(*.png *.jpg *.jpeg *.gif *.svg *.otf)
    config.assets.precompile += %w( rollbar.js )
    config.assets.initialize_on_precompile = false

    # Do not swallow errors in after_commit/after_rollback callbacks.
    config.active_record.raise_in_transactional_callbacks = true

    config.active_job.queue_adapter = :sidekiq

    config.action_mailer.preview_path = "#{Rails.root}/app/mailer_previews"

    config.action_dispatch.rescue_responses.merge!(
      'AuthorizationException' => :unauthorized
    )

    config.to_prepare do
      Devise::SessionsController.layout "login_page"
      Devise::PasswordsController.layout "login_page"
    end

    config.use_darksky_api = true
  end
end
