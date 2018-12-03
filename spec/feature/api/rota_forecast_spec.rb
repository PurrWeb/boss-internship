require 'rails_helper'

RSpec.describe 'Api access' do
  include Rack::Test::Methods
  include HeaderHelpers
  include ActiveSupport::Testing::TimeHelpers

  let(:date) { RotaWeek.new(RotaShiftDate.to_rota_date(Time.current)).start_date }
  let(:venue) { FactoryGirl.create(:venue) }
  let(:rota) do
    FactoryGirl.create(
      :rota,
      venue: venue,
      date: date
    )
  end
  let(:user) { FactoryGirl.create(:user, :dev) }
  let(:access_token) do
    WebApiAccessToken.new(
      expires_at: 30.minutes.from_now,
      user: user
    ).persist!
  end

  before do
    set_authorization_header(access_token.token)
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
            forecasted_take_cents: 10000000,
            total_cents: 4000000,
            overhead_total_cents: 2000000,
            staff_total_cents: 10000,
            pr_total_cents: 500000,
            kitchen_total_cents: 250000,
            security_total_cents: 250000
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
            Time.zone.now.beginning_of_day + 3.hours,
            Time.zone.now.beginning_of_day + 2.hours
          ]
        end

        let(:forecasted_takes) do
          [
            2000000,
            1000000
          ]
        end

        let(:rota_forecasts) do
          forecasts = []
          forecast_times.each_with_index do |time, index|
            travel_to time do
              forecasts << FactoryGirl.create(
                :rota_forecast,
                forecasted_take_cents: forecasted_takes[index],
                total_cents: 4000000,
                overhead_total_cents: 2000000,
                staff_total_cents: 1000000,
                pr_total_cents: 500000,
                kitchen_total_cents: 250000,
                security_total_cents: 250000
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

          expect(json["forecasted_take_cents"]).to eq(forecasted_takes.first)
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
      let(:forecasted_take_cents) { 200000 }
      let(:response) { post(url, forecasted_take_cents: forecasted_take_cents) }

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
            forecasted_take_cents: 10000000,
            total_cents: 4000000,
            overhead_total_cents: 2000000,
            staff_total_cents: 1000000,
            pr_total_cents: 500000,
            kitchen_total_cents: 250000,
            security_total_cents: 250000
          )
        end

        before do
          travel_to(date - 1.day) do
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

    describe '#weekly_show' do
      let(:url) do
        url_helpers.
          weekly_api_v1_venue_rota_forecast_path(
            venue_id: venue.id,
            id: UIRotaDate.format(date)
          )
      end
      let(:response) { get(url) }

      specify do
        expect(response.status).to eq(ok_status)
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
    ["id", "url", "venue", "date", "forecasted_take_cents", "total_cents", "total_percentage", "overhead_total_cents", "overhead_total_percentage", "staff_total_cents", "staff_total_percentage", "pr_total_cents", "pr_total_percentage", "kitchen_total_cents" , "kitchen_total_percentage", "security_total_cents", "security_total_percentage", "venue_overheads_threshold_percentage", "venue_staff_threshold_percentage", "venue_pr_threshold_percentage", "venue_kitchen_threshold_percentage", "venue_security_threshold_percentage"]
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
      "forecasted_take_cents" => forecast.forecasted_take_cents,
      "total_cents" => forecast.total_cents,
      "total_percentage" => forecast.total_percentage,
      "staff_total_cents" => forecast.staff_total_cents,
      "staff_total_percentage" => forecast.staff_total_percentage,
      "pr_total_cents" => forecast.pr_total_cents,
      "pr_total_percentage" => forecast.pr_total_percentage,
      "security_total_cents" => forecast.security_total_cents,
      "security_total_percentage" => forecast.security_total_percentage,
      "kitchen_total_cents" => forecast.kitchen_total_cents,
      "kitchen_total_percentage" => forecast.kitchen_total_percentage
    }
  end
end
