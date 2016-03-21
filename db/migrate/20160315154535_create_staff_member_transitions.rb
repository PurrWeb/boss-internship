class CreateStaffMemberTransitions < ActiveRecord::Migration
  def change
    create_table :staff_member_transitions do |t|
      t.string :to_state, null: false
      t.text :metadata
      t.integer :sort_key, null: false
      t.integer :staff_member_id, null: false
      t.boolean :most_recent
      t.timestamps null: false
    end

    add_index(:staff_member_transitions,
              [:staff_member_id, :sort_key],
              unique: true,
              name: "index_staff_member_transitions_parent_sort")
    add_index(:staff_member_transitions,
              [:staff_member_id, :most_recent],
              unique: true,
              
              name: "index_staff_member_transitions_parent_most_recent")
  end
end
