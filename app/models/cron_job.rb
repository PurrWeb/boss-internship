class CronJob < ActiveRecord::Base
  validates :method,     presence: true
  validates :started_at, presence: true
end
