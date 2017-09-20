require 'rails_helper'

describe CleanupForecastsJob do
  include ActiveSupport::Testing::TimeHelpers
  include ActiveJob::TestHelper

  let(:now) { Time.zone.now }
  let(:call_time) { now }
  let(:time_cutoff) { now - 4.weeks }
  let(:job) { CleanupForecastsJob.new }
  let(:forecasts) { recent_forecasts + old_forecasts }
  let(:recent_forecasts) do
    result = []
    date = (now - 1.week).to_date
    Array.new(3) do
      rota = FactoryGirl.create(:rota, date: date)
      result << FactoryGirl.create(
        :rota_forecast,
        rota: rota,
        forecasted_take_cents: 1000,
        total_cents: 1000,
        overhead_total_cents: 1000,
        staff_total_cents: 1000,
        pr_total_cents: 1000,
        kitchen_total_cents: 1000,
        security_total_cents: 1000
      )

      date = date - 1.day
    end
    result
  end
  let(:old_forecasts) do
    result = []
    date = (time_cutoff - 1.week).to_date
    Array.new(3) do
      rota = FactoryGirl.create(:rota, date: date)
      result << FactoryGirl.create(
        :rota_forecast,
        rota: rota,
        forecasted_take_cents: 1000,
        overhead_total_cents: 1000,
        total_cents: 1000,
        staff_total_cents: 1000,
        pr_total_cents: 1000,
        kitchen_total_cents: 1000,
        security_total_cents: 1000
      )
      date = date - 1.day
    end
    result
  end

  before do
    forecasts
  end

  specify do
    travel_to call_time do
      job.perform
    end

    recent_forecasts.each do |forecast|
      expect(forecast.destroyed?).to eq(false)
    end
    old_forecasts.each do |forecast|

      expect(RotaForecast.find_by(id: forecast.id)).to eq(nil)
    end
  end
end
