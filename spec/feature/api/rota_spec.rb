require 'rails_helper'

RSpec.describe 'Api access' do
  include Rack::Test::Methods
  include HeaderHelpers

  let(:rota) { FactoryGirl.create(:rota) }
  let(:user) { FactoryGirl.create(:user, venues: [rota.venue]) }
  let(:access_token) do
    AccessToken.create!(
      token_type: 'web',
      expires_at: 30.minutes.from_now,
      creator: user,
      user: user
    )
  end

  before do
    set_token_header(access_token)
  end

  describe '#show' do
    let(:url) { url_helpers.api_v1_rota_path(rota) }

    describe 'response' do
      let(:response) { get(url) }

      specify 'should succeed' do
        expect(response.status).to eq(ok_status)
      end

      specify 'should return a json representation of the rota' do
        json = JSON.parse(response.body)
        expect(json).to eq({
          "id" => rota.id,
          "url" => url_helpers.api_v1_rota_url(rota),
          "venue" => {
            "id" => rota.venue.id,
            "url" => url_helpers.api_v1_venue_url(rota.venue)
          },
          "date" => rota.date.iso8601,
          "status" => rota.status
        })
      end
    end
  end

  describe '#mark_finished' do
    let(:url) { url_helpers.mark_finished_api_v1_venue_rota_path(id: UIRotaDate.format(rota.date), venue_id: rota.venue.id) }
    let(:response) { post(url) }

    describe 'response' do
      specify 'should succeed' do
        expect(response.status).to eq(ok_status)
      end

      specify 'should return a json representation of the rota' do
        json = JSON.parse(response.body)
        expect(json).to eq({
          "id" => rota.id,
          "url" => url_helpers.api_v1_rota_url(rota),
          "venue" => {
            "id" => rota.venue.id,
            "url" => url_helpers.api_v1_venue_url(rota.venue)
          },
          "date" => rota.date.iso8601,
          "status" => rota.status
        })
      end
    end

    context 'rota is not in progress' do
      let(:rota) { FactoryGirl.create(:rota, :finished) }

      specify 'should not succeed' do
        expect{
          response.status
        }.to raise_error(Statesman::TransitionFailedError)
      end
    end
  end

  describe '#mark_in_progress' do
    let(:url) do
      url_helpers.mark_in_progress_api_v1_venue_rota_path(id: UIRotaDate.format(rota.date), venue_id: rota.venue.id)
    end
    let(:response) { post(url) }

    context 'rota finished' do
      let(:rota) { FactoryGirl.create(:rota, :finished) }

      describe 'response' do
        specify 'should succeed' do
          expect(response.status).to eq(ok_status)
        end

        specify 'should return a json representation of the rota' do
          json = JSON.parse(response.body)
          expect(json).to eq({
            "id" => rota.id,
            "url" => url_helpers.api_v1_rota_url(rota),
            "venue" => {
              "id" => rota.venue.id,
              "url" => url_helpers.api_v1_venue_url(rota.venue)
            },
            "date" => rota.date.iso8601,
            "status" => rota.status
          })
        end
      end
    end

    context 'rota is already in progress' do
      let(:rota) { FactoryGirl.create(:rota, :in_progress) }

      specify 'cause error' do
        expect{
          response.status
        }.to raise_error(Statesman::TransitionFailedError)
      end
    end
  end

  describe '#publish' do
    let(:url) do
      url_helpers.publish_api_v1_venue_rotas_path(
        venue_id: venue.id,
        date: UIRotaDate.format(start_date)
      )
    end
    let(:response) { post(url) }
    let(:venue) { FactoryGirl.create(:venue) }
    let(:user) { FactoryGirl.create(:user, :admin)}
    let(:start_date) { Time.zone.now.beginning_of_week.to_date }
    let(:end_date) { Time.zone.now.end_of_week.to_date }

    specify 'should be a success' do
      expect(response.status).to eq(200)
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
end
