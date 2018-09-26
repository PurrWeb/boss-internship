class AddTaxAndNiToRotaForecastsTotal < ActiveRecord::Migration
  def change
    ActiveRecord::Base.transaction do
      RotaForecast.all.each do |rota_forecast|
        tax_and_ni = (rota_forecast.overhead_total_cents + rota_forecast.kitchen_total_cents + rota_forecast.staff_total_cents) * 0.08
        total_with_tax = rota_forecast.total_cents + tax_and_ni
        rota_forecast.update!({
          total_cents: total_with_tax
        })
      end
    end
  end
end
