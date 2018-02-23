class CreateMarketingTaskTransitions < ActiveRecord::Migration
  def change
    create_table :marketing_task_transitions do |t|
      t.string :to_state, null: false
      t.text :metadata
      t.integer :sort_key, null: false
      t.integer :marketing_task_id, null: false
      t.boolean :most_recent
      t.timestamps null: false
    end

    add_index(:marketing_task_transitions,
              [:marketing_task_id, :sort_key],
              unique: true,
              name: "index_marketing_task_transitions_parent_sort")
    add_index(:marketing_task_transitions,
              [:marketing_task_id, :most_recent],
              unique: true,
              
              name: "index_marketing_task_transitions_parent_most_recent")
  end
end
