class AddDailyReportTables < ActiveRecord::Migration
  def change
    create_table :daily_reports do |t|
      t.integer :venue_id, null: false
      t.date :date, null: false
      t.integer :overheads_cents, null: false
      t.integer :rotaed_cost_cents, null: false
      t.integer :actual_cost_cents, null: false
      t.boolean :update_required, null: false
      t.datetime :last_calculated_at
      t.timestamps

      t.index [:venue_id, :date]
    end

    create_table :daily_report_staff_member_sections do |t|
      t.integer :daily_report_id, null: false
      t.integer :staff_type_id, null: false
      t.integer :overhead_cost_cents, null: false
      t.integer :rotaed_cost_cents, null: false
      t.integer :actual_cost_cents, null: false
      t.timestamps

      t.index :daily_report_id
      t.index :staff_type_id
    end

    create_table :daily_report_staff_member_listings do |t|
      t.integer :daily_report_staff_member_section_id, null: false
      t.integer :staff_member_id, null: false
      t.string :pay_rate_name, null: false
      t.integer :pay_rate_cents, null: false
      t.string :pay_rate_text_description_short, null: false
      t.string :pay_rate_calculation_type, null: false
      t.boolean :pay_rate_admin, null: false
      t.integer :rotaed_cost_cents, null: false
      t.integer :actual_cost_cents, null: false
      t.float :rotaed_hours, null: false
      t.float :worked_hours, null: false
      t.float :break_hours, null: false
      t.timestamps

      t.index :daily_report_staff_member_section_id, name: "daily_report_section_index"
      t.index :staff_member_id
    end
  end
end
