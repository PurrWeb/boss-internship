class CreateCronJobsTable < ActiveRecord::Migration
  def change
    create_table :cron_jobs do |t|
      t.string :method, null: false
      t.string :output
      t.datetime :started_at, null: false
      t.datetime :finished_at
      t.string :error
      t.timestamps
      t.index :started_at
    end
  end
end
