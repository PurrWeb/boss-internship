class RenameClockingEvent < ActiveRecord::Migration
  def change
    rename_table :clocking_events, :clock_in_events
    rename_column :clock_in_period_events, :clocking_event_id, :clock_in_event_id
  end
end
