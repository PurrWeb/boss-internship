class AddTimestampsToForecasts < ActiveRecord::Migration
  def change
    change_table :rota_forecasts do |t|
      t.timestamps
    end
  end
end
