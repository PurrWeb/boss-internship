class CreateMaintenanceTasks < ActiveRecord::Migration
  def change
    create_table :maintenance_tasks do |t|
      t.string :title, null: false
      t.text :description, null: false
      t.integer :priority, null: false
      t.references :venue, null: false, index: true
      t.references :creator_user, null: false, index: true
      t.datetime :disabled_at
      t.references :disabled_by_user

      t.timestamps null: false
    end
  end
end
