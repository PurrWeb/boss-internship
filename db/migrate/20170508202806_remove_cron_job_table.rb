class RemoveCronJobTable < ActiveRecord::Migration
  class CronJob < ActiveRecord::Base
  end

  def change
    CronJob.delete_all
  end
end
