class AddClockInPeriodEventJoinTable < ActiveRecord::Migration
  def change
    create_table :clock_in_period_events do |t|
      t.integer :clocking_event_id, null: false
      t.integer :clock_in_period_id, null: false
      t.timestamps
    end
  end
end
