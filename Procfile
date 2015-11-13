web: bundle exec rails server -p $PORT
worker: bundle exec sidekiq --concurrency 5 -q default
migrate: bundle exec rake db:migrate
