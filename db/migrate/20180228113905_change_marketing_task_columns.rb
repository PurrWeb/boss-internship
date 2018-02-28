class ChangeMarketingTaskColumns < ActiveRecord::Migration
  def change
    change_column :marketing_tasks, :description, :text
    change_column :marketing_task_notes, :note, :text
  end
end
