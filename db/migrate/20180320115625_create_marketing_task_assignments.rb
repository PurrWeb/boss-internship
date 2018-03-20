class CreateMarketingTaskAssignments < ActiveRecord::Migration
  def change
    create_table :marketing_task_assignments do |t|
      t.references :marketing_task, index: true
      t.references :user, index: true
      t.string :state

      t.timestamps
    end
  end
end
