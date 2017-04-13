class AddDatesToOwedHours < ActiveRecord::Migration
  def change
    change_table :owed_hours do |t|
      t.rename :week_start_date, :date
      t.boolean :require_times, null: false, default: false
      t.datetime :starts_at
      t.datetime :ends_at

      t.index :date
    end

    change_column_default :owed_hours, :require_times, true
  end
end
