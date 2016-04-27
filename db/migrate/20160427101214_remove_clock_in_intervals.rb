class RemoveClockInIntervals < ActiveRecord::Migration
  def change
    drop_table :clock_in_intervals
  end
end
