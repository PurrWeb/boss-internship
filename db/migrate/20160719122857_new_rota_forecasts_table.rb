class NewRotaForecastsTable < ActiveRecord::Migration
  def change
    create_table :rota_forecasts do |t|
      t.integer :rota_id, null: false
      t.integer :forecasted_take_cents, null: false
      t.integer :overhead_total_cents, null: false
      t.integer :total_cents, null: false
      t.integer :staff_total_cents, null: false
      t.integer :pr_total_cents, null: false
      t.integer :kitchen_total_cents, null: false
      t.integer :security_total_cents, null: false
      t.timestamps

      t.index :rota_id
    end
  end
end
