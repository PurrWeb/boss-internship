require 'rails_helper'

RSpec.describe 'Api access' do
  include Rack::Test::Methods
  include ActiveSupport::Testing::TimeHelpers

  let(:date) { RotaWeek.new(Time.now).start_date }
  let(:venue) { FactoryGirl.create(:venue) }
  let(:rota) do
    FactoryGirl.create(
      :rota,
      venue: venue,
      date: date
    )
  end
  let(:user) { FactoryGirl.create(:user, :dev) }

  before do
    login_as user
  end

  describe '#show' do
    let(:url) do
      url_helpers.
        api_v1_venue_rota_forecast_path(
          venue_id: venue.id,
          id: UIRotaDate.format(date)
        )
    end

    describe 'response' do
      let(:response) { get(url) }

      context 'when no forecasts exist' do
        specify 'should succeed' do
          expect(response.status).to eq(ok_status)
        end

        specify 'should return a json representation of the unpersisted forecast' do
          json = JSON.parse(response.body)
          expect(json.keys).to eq(forecast_keys)
          expect(json["id"]).to eq(nil)
        end
      end

      context '1 forecast exits' do
        let!(:rota_forecast) do
          FactoryGirl.create(
            :rota_forecast,
            rota: rota,
            forecasted_take: Money.from_amount(100000),
            total: Money.from_amount(20000),
            staff_total: Money.from_amount(10000),
            pr_total: Money.from_amount(5000),
            kitchen_total: Money.from_amount(2500),
            security_total: Money.from_amount(2500)
          )
        end

        specify 'should succeed' do
          expect(response.status).to eq(ok_status)
        end

        specify 'should return a json representation of the forecast' do
          json = JSON.parse(response.body)
          expect(json).to include(expected_values_for(rota_forecast))
        end
      end


      context 'when mutliple forecasts exist' do
        let(:forecast_times) do
          [
            Time.now.beginning_of_day + 3.hours,
            Time.now.beginning_of_day + 2.hours
          ]
        end

        let(:forecasted_takes) do
          [
            Money.from_amount(20000),
            Money.from_amount(10000)
          ]
        end

        let(:rota_forecasts) do
          forecasts = []
          forecast_times.each_with_index do |time, index|
            travel_to time do
              forecasts << FactoryGirl.create(
                :rota_forecast,
                forecasted_take: forecasted_takes[index],
                total: Money.from_amount(20000),
                staff_total: Money.from_amount(10000),
                pr_total: Money.from_amount(5000),
                kitchen_total: Money.from_amount(2500),
                security_total: Money.from_amount(2500)
              )
            end
          end
          forecasts
        end

        let(:url) do
          url_helpers.
            api_v1_venue_rota_forecast_path(
              venue_id: rota_forecasts.first.rota.venue.id,
              id: UIRotaDate.format(rota_forecasts.first.rota.date)
            )
        end

        specify 'it should return the latest forecast created' do
          json = JSON.parse(response.body)

          expect(json["forecasted_take"]).to eq(Float(forecasted_takes.first.to_s))
        end
      end
    end

    describe '#update' do
      let(:url) do
        url_helpers.
          api_v1_venue_rota_forecast_path(
            venue_id: venue.id,
            id: UIRotaDate.format(date)
          )
      end
      let(:forecasted_take) { Money.from_amount(2000) }
      let(:response) { post(url, forecasted_take: forecasted_take) }

      context 'before call' do
        specify 'no forecasts should exist' do
          expect(RotaForecast.count).to eq(0)
        end

        specify 'no rota should exist' do
          expect(Rota.count).to eq(0)
        end
      end

      context 'after_call' do
        specify 'it should succeed' do
          expect(response.status).to eq(ok_status)
        end

        specify 'it should persist a forecast' do
          response
          expect(RotaForecast.count).to eq(1)
        end

        specify 'it should persist a rota' do
          response
          expect(Rota.count).to eq(1)
        end

        specify 'it should return json representation of the forecast' do
          json = JSON.parse(response.body)
          expect(json).to include(expected_values_for(RotaForecast.last))
        end
      end

      context 'forecast exists for date' do
        let(:rota_forecast) do
          FactoryGirl.create(
            :rota_forecast,
            rota: rota,
            forecasted_take: Money.from_amount(100000),
            total: Money.from_amount(20000),
            staff_total: Money.from_amount(10000),
            pr_total: Money.from_amount(5000),
            kitchen_total: Money.from_amount(2500),
            security_total: Money.from_amount(2500)
          )
        end

        before do
          travel_to(1.day.ago) do
            rota_forecast
          end
        end

        context 'before call' do
          specify '1 forecast should exist' do
            expect(RotaForecast.count).to eq(1)
          end

          specify '1 rota should exist' do
            expect(Rota.count).to eq(1)
          end
        end

        specify 'it should succeed' do
          expect(response.status).to eq(ok_status)
        end

        specify 'it should persist a forecast' do
          response
          expect(RotaForecast.count).to eq(2)
        end

        specify 'it not should persist a rota' do
          response
          expect(Rota.count).to eq(1)
        end

        specify 'it should return json representation of the new forecast' do
          json = JSON.parse(response.body)
          expect(json).to include(expected_values_for(RotaForecast.last))
        end
      end
    end
  end

  private
  def app
    Rails.application
  end

  def url_helpers
    Rails.application.routes.url_helpers
  end

  def ok_status
    200
  end

  def unauthorised_status
    401
  end

  def forecast_keys
    ["id", "url", "venue", "date", "forecasted_take", "total", "total_percentage", "staff_total", "staff_total_percentage", "pr_total", "pr_total_percentage", "kitchen_total" , "kitchen_total_percentage", "security_total", "security_total_percentage"]
  end

  def expected_values_for(forecast)
    {
      "id" => forecast.id,
      "url" => url_helpers.
        api_v1_venue_rota_forecast_url(
          venue_id: forecast.rota.venue.id,
          id: UIRotaDate.format(forecast.rota.date)
        ),
      "date" => forecast.date.iso8601,
      "forecasted_take" => Float(forecast.forecasted_take.to_s),
      "total" => Float(forecast.total.to_s),
      "total_percentage" => forecast.total_percentage,
      "staff_total" => Float(forecast.staff_total.to_s),
      "staff_total_percentage" => forecast.staff_total_percentage,
      "pr_total" => Float(forecast.pr_total.to_s),
      "pr_total_percentage" => forecast.pr_total_percentage,
      "security_total" => Float(forecast.security_total.to_s),
      "security_total_percentage" => forecast.security_total_percentage,
      "kitchen_total" => Float(forecast.kitchen_total.to_s),
      "kitchen_total_percentage" => forecast.kitchen_total_percentage
    }
  end
end
