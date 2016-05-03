class AddClockInPeriod < ActiveRecord::Migration
  def change
    create_table :clock_in_periods do |t|
      t.string   :period_type, null: false
      t.date     :date, null: false
      t.integer  :staff_member_id, null: false
      t.integer  :venue_id, null: false
      t.integer  :creator_id, null: false
      t.integer  :clock_in_period_reason_id
      t.string   :reason_note
      t.datetime :starts_at, null: false
      t.datetime :ends_at
      t.timestamps
    end

    create_table :clock_in_breaks do |t|
      t.integer  :clock_in_period_id, null: false
      t.datetime :starts_at, null: false
      t.datetime :ends_at, null: false
      t.timestamps
    end

    create_table :clock_in_period_reasons do |t|
      t.string :text, null: false
      t.timestamps
    end
  end
end
