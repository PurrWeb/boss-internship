class LinkClockInPeriodToClockInDay < ActiveRecord::Migration
  def change
    change_table :clock_in_periods do |t|
      t.integer :clock_in_day_id
    end

    ClockInPeriod.find_each do |period|
      clock_in_day = ClockInDay.find_or_create_by!(
        date: period.date,
        staff_member: period.staff_member,
        venue: period.venue
      )

      period.update_attributes!(clock_in_day: clock_in_day)
    end

    change_column_null :clock_in_periods, :clock_in_day_id, false

    change_table :clock_in_periods do |t|
      t.remove :date
      t.remove :staff_member_id
      t.remove :venue_id
    end
  end
end
