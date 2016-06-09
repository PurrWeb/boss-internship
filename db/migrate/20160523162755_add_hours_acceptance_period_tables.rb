class AddHoursAcceptancePeriodTables < ActiveRecord::Migration
  def change
    create_table :hours_acceptance_periods do |t|
      t.integer  :creator_id, null: false
      t.string   :creator_type, null: false
      t.integer  :hours_acceptance_reason_id
      t.string   :reason_note
      t.datetime :starts_at, null: false
      t.datetime :ends_at, null: false
      t.integer  :clock_in_day_id
      t.string   :status, null: false, default: 'pending'
      t.timestamps
    end

    create_table :hours_acceptance_breaks do |t|
      t.integer  :hours_acceptance_period_id, limit: 4, null: false
      t.datetime :starts_at,                    null: false
      t.datetime :ends_at,                      null: false
      t.timestamps
    end

    create_table :hours_acceptance_reasons do |t|
      t.string   :text,       limit: 255, null: false
      t.integer  :rank,       limit: 4,   null: false
      t.boolean  :enabled,                null: false
      t.timestamps
    end
  end
end
