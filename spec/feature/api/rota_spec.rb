require 'rails_helper'

RSpec.describe 'Api access' do
  include Rack::Test::Methods
  let(:rota) { FactoryGirl.create(:rota) }
  let(:user) { FactoryGirl.create(:user, venues: [rota.venue]) }

  before do
    login_as user
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
    let(:url) { url_helpers.mark_finished_api_v1_rota_path(rota) }
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

      specify 'should succeed' do
        expect{
          response.status
        }.to raise_error(Statesman::TransitionFailedError)
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
end
