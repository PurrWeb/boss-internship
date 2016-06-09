class ClockInDaysTable < ActiveRecord::Migration
  def change
    create_table :clock_in_days do |t|
      t.date     "date",                      null: false
      t.integer  "staff_member_id", limit: 4, null: false
      t.integer  "venue_id",        limit: 4, null: false
      t.integer  "creator_id",      limit: 4, null: false
      t.string   "creator_type",    null: false
      t.timestamps
    end
  end
end
