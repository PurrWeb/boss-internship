class CreateHolidayRequestTransitions < ActiveRecord::Migration
  def change
    create_table :holiday_request_transitions do |t|
      t.string :to_state, null: false
      t.text :metadata
      t.integer :sort_key, null: false
      t.integer :holiday_request_id, null: false
      t.boolean :most_recent
      t.timestamps null: false
    end

    add_index(:holiday_request_transitions,
              [:holiday_request_id, :sort_key],
              unique: true,
              name: "index_holiday_request_transitions_parent_sort")
    add_index(:holiday_request_transitions,
              [:holiday_request_id, :most_recent],
              unique: true,
              
              name: "index_holiday_request_transitions_parent_most_recent")
  end
end
