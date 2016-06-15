class FinanceFreezeFields < ActiveRecord::Migration
  def change
    create_table :finance_reports do |t|
      t.integer :staff_member_id, null: false
      t.string  :staff_member_name, null: false
      t.integer :venue_id, null: false
      t.string  :venue_name, null: false
      t.date    :week_start, null: false
      t.float   :monday_hours_count, null: false
      t.float   :tuesday_hours_count, null: false
      t.float   :wednesday_hours_count, null: false
      t.float   :thursday_hours_count, null: false
      t.float   :friday_hours_count, null: false
      t.float   :saturday_hours_count, null: false
      t.float   :sunday_hours_count, null: false
      t.float   :total_hours_count, null: false
      t.integer :total_cents, null: false
      t.integer :holiday_days_count, null: false
      t.integer :owed_hours_minute_count, null: false
      t.string  :pay_rate_description, null: false
      t.timestamps

      t.index :week_start
      t.index :staff_member_id
      t.index :venue_id

      t.index [:week_start, :staff_member_id], unique: true
    end

    change_table :hours_acceptance_periods do |t|
      t.integer :frozen_by_finance_report_id
    end

    change_table :holidays do |t|
      t.integer :frozen_by_finance_report_id
    end

    change_table :owed_hours do |t|
      t.integer :frozen_by_finance_report_id
    end
  end
end
