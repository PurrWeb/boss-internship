class CreateMaintenanceTaskTransitions < ActiveRecord::Migration
  def change
    create_table :maintenance_task_transitions do |t|
      t.string :to_state, null: false
      t.text :metadata
      t.integer :sort_key, null: false
      t.integer :maintenance_task_id, null: false
      t.boolean :most_recent
      t.timestamps null: false
    end

    add_index(:maintenance_task_transitions,
              [:maintenance_task_id, :sort_key],
              unique: true,
              name: "index_maintenance_task_transitions_parent_sort")
    add_index(:maintenance_task_transitions,
              [:maintenance_task_id, :most_recent],
              unique: true,
              
              name: "index_maintenance_task_transitions_parent_most_recent")
  end
end
