class CreateApiKeyTransitions < ActiveRecord::Migration
  def change
    create_table :api_key_transitions do |t|
      t.string :to_state, null: false
      t.text :metadata
      t.integer :sort_key, null: false
      t.integer :api_key_id, null: false
      t.boolean :most_recent
      t.timestamps null: false
    end

    add_index(:api_key_transitions,
              [:api_key_id, :sort_key],
              unique: true,
              name: "index_api_key_transitions_parent_sort")
    add_index(:api_key_transitions,
              [:api_key_id, :most_recent],
              unique: true,
              
              name: "index_api_key_transitions_parent_most_recent")
  end
end
