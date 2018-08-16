require "clockwork"
require "rollbar"
require "securerandom"
require "sidekiq"

Sidekiq.configure_client do |config|
  config.redis = {
    url: ENV["REDIS_URL"],
    db:  ENV["REDIS_DB"]  || "0"
  }
end

module Clockwork
  # Clockwork is responsible for queueing recurring jobs in Sidekiq.
  #
  # It is intentionally light (i.e. does not require the app) to keep the
  # memory footprint small.
  #
  # Compare with:
  #
  # * ActiveJob::QueueAdapters::SidekiqAdapter.enqueue
  #   https://github.com/rails/rails/blob/v4.2.0/activejob/lib/active_job/queue_adapters/sidekiq_adapter.rb#L19-L25
  #
  # * ActiveJob::Base#serialize
  #   https://github.com/rails/rails/blob/v4.2.0/activejob/lib/active_job/core.rb#L63-L70

  QUEUE_NAME = "cron"

  handler do |klass|
    begin
      jid = Sidekiq::Client.push(
        "class" => "ActiveJob::QueueAdapters::SidekiqAdapter::JobWrapper",
        "queue" => QUEUE_NAME,
        "retry" => false,
        "args"  => [{
          "job_class"  => klass,
          "job_id"     => SecureRandom.uuid,
          "queue_name" => QUEUE_NAME,
          "arguments"  => []
        }]
      )
      manager.log "Queued #{klass} with ID #{jid}"
    end
  end

  error_handler do |e|
    Rollbar.error(e)
  end

  every(15.seconds, "ProcessDailyReportsJob")
  every(20.minutes, "ShiftUpdateNotificationJob")
  every(30.seconds, "ProcessFinanceReportUpdatesJob")
  every(1.week, "ChangeOrderReminderJob",     at: "Sunday 23:00", tz: 'Europe/London')
  every(1.week, "TuesdayFruitOrderReminderJob", at: "Sunday 23:00", tz: 'Europe/London')
  every(1.week, "FridayFruitOrderReminderJob", at: "Thursday 23:00", tz: 'Europe/London')
  every(1.hour, "BackupDatabaseJob",      at: "**:00")
  every(1.day,  "CleanBackupsJob",        at: "23:00")
  every(1.day, "SiaBadgeExpiryNotificationJob", at: "9:00")
  every(1.day, "CleanupForecastsJob", at: "10:00")
  every(2.hour, "UpdateBouncedEmailsJob", at: "**:00")
  every(1.day, "MoveStaffMembersToCorrectPayRateJob", at: "10:00")
end
