Sidekiq.configure_server do |config|
  config.redis = { url: ENV["REDIS_URL"] }
end

Sidekiq.configure_client do |config|
  config.redis = { url: ENV["REDIS_URL"] }
end

if Rails.env.development?
  require 'sidekiq/testing'
  Sidekiq::Testing.inline!
end

Sidekiq.default_worker_options = {
  unique: :until_executing,
  unique_args: -> (args) { [ args.first.except('job_id') ] }
}
