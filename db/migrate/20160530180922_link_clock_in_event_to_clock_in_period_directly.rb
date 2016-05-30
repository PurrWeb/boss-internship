class LinkClockInEventToClockInPeriodDirectly < ActiveRecord::Migration
  def change
    change_table :clock_in_events do |t|
      t.integer :clock_in_period_id
    end

    ActiveRecord::Base.transaction do
      ClockInEvent.find_each do |event|
        period = event.clock_in_period
        event.update_attributes!(clock_in_period_id: period.id)
      end
    end

    change_column_null :clock_in_events, :clock_in_period_id, false
    change_table :clock_in_events do |t|
      t.remove :venue_id
      t.remove :staff_member_id
    end
    drop_table :clock_in_period_events
  end
end
