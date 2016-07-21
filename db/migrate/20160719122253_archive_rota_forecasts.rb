class ArchiveRotaForecasts < ActiveRecord::Migration
  def change
     rename_table :rota_forecasts, :legacy_rota_forecasts
  end
end
