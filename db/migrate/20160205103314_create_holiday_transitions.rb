class CreateHolidayTransitions < ActiveRecord::Migration
  def change
    create_table :holiday_transitions do |t|
      t.string :to_state, null: false
      t.text :metadata
      t.integer :sort_key, null: false
      t.integer :holiday_id, null: false
      t.boolean :most_recent
      t.timestamps null: false
    end

    add_index(:holiday_transitions,
              [:holiday_id, :sort_key],
              unique: true,
              name: "index_holiday_transitions_parent_sort")
    add_index(:holiday_transitions,
              [:holiday_id, :most_recent],
              unique: true,
              
              name: "index_holiday_transitions_parent_most_recent")
  end
end
