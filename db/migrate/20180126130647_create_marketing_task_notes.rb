class CreateMarketingTaskNotes < ActiveRecord::Migration
  def change
    create_table :marketing_task_notes do |t|
      t.references :marketing_task, null: false, index: true
      t.references :creator_user, null: false, index: true
      t.string :note, null: false
      t.datetime :disabled_at
      t.references :disabled_by_user

      t.timestamps null: false
    end
  end
end
