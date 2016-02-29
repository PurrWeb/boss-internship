class AddRotaForecasts < ActiveRecord::Migration
  def change
    create_table :rota_forecasts do |t|
      t.integer :rota_id
      t.integer :forecasted_take_cents
      t.integer :total_cents
      t.integer :staff_total_cents
      t.integer :pr_total_cents
      t.integer :kitchen_total_cents
      t.integer :security_total_cents

      t.index :rota_id
    end
  end
end
