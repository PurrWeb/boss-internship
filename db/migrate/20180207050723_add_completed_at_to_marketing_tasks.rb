class AddCompletedAtToMarketingTasks < ActiveRecord::Migration
  def change
    add_column :marketing_tasks, :completed_at, :datetime
    add_reference :marketing_tasks, :completed_by_user, index: true
  end
end
