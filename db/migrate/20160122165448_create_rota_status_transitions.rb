class CreateRotaStatusTransitions < ActiveRecord::Migration
  def change
    create_table :rota_status_transitions do |t|
      t.string :to_state, null: false
      t.text :metadata
      t.integer :sort_key, null: false
      t.integer :rota_id, null: false
      t.boolean :most_recent
      t.timestamps null: false
    end

    add_index(:rota_status_transitions,
              [:rota_id, :sort_key],
              unique: true,
              name: "index_rota_status_transitions_parent_sort")
    add_index(:rota_status_transitions,
              [:rota_id, :most_recent],
              unique: true,
              
              name: "index_rota_status_transitions_parent_most_recent")
  end
end
