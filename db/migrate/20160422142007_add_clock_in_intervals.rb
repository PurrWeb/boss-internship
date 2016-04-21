class AddClockInIntervals < ActiveRecord::Migration
  def change
    create_table :clock_in_intervals do |t|
      t.string  :interval_type, null: false
      t.integer :start_clocking_event_id, null: false
      t.integer :end_clocking_event_id, null: false
      t.timestamps
    end
  end
end
