class RecurringJob < ActiveJob::Base
  around_perform do |job, block|
    cron_job = nil
    begin
      cron_job = CronJob.create!(method: job.class, started_at: Time.zone.now)
      cron_job.output = block.call
      cron_job.save!
    rescue => e
      begin
        cron_job.update_attribute(:error, e.message) if cron_job
      rescue
      end
      raise
    ensure
      cron_job.update_attributes(finished_at: Time.zone.now)
    end
  end
end
