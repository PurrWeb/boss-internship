web: bundle exec rails server -p $PORT
worker: bundle exec sidekiq --concurrency 5 -q default
clock: clockwork lib/clock.rb
migrate: bundle exec rake db:migrate
