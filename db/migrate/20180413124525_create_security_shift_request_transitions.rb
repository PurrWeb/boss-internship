class CreateSecurityShiftRequestTransitions < ActiveRecord::Migration
  def change
    create_table :security_shift_request_transitions do |t|
      t.string :to_state, null: false
      t.text :metadata
      t.integer :sort_key, null: false
      t.integer :security_shift_request_id, null: false
      t.boolean :most_recent
      t.timestamps null: false
    end

    add_index(:security_shift_request_transitions,
      [:security_shift_request_id, :sort_key],
      unique: true,
      name: "index_security_shift_request_transitions_parent_sort")
    add_index(:security_shift_request_transitions,
      [:security_shift_request_id, :most_recent],
      unique: true,

      name: "index_security_shift_request_transitions_parent_most_recent")
  end
end
