class CreateClockingEventTable < ActiveRecord::Migration
  def change
    create_table :clocking_events do |t|
      t.string :event_type, null: false
      t.integer :venue_id, null: false
      t.integer :staff_member_id, null: false
      t.integer :creator_id, null: false
      t.string  :creator_type, null: false
      t.datetime :at, null: false
      t.timestamps

      t.index :at
    end
  end
end
