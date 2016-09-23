class ChangeCronJobOutputColumn < ActiveRecord::Migration
  def change
    change_column :cron_jobs, :output, :text
  end
end
