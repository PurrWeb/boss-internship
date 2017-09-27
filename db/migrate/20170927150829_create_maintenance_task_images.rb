class CreateMaintenanceTaskImages < ActiveRecord::Migration
  def change
    create_table :maintenance_task_images do |t|
      t.string :file, null: false
      t.references :maintenance_task, index: true

      t.timestamps null: false
    end
  end
end
