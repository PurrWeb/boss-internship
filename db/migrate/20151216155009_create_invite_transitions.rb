class CreateInviteTransitions < ActiveRecord::Migration
  def change
    create_table :invite_transitions do |t|
      t.string :to_state, null: false
      t.text :metadata
      t.integer :sort_key, null: false
      t.integer :invite_id, null: false
      t.boolean :most_recent
      t.timestamps null: false
    end

    add_index(:invite_transitions,
              [:invite_id, :sort_key],
              unique: true,
              name: "index_invite_transitions_parent_sort")
    add_index(:invite_transitions,
              [:invite_id, :most_recent],
              unique: true,
              
              name: "index_invite_transitions_parent_most_recent")
  end
end
