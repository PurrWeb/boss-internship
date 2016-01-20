require 'rails_helper'

RSpec.describe 'Api access' do
  include Rack::Test::Methods
  let(:rota) { FactoryGirl.create(:rota) }
  let(:user) { FactoryGirl.create(:user) }

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
          "venue_id" => rota.venue_id,
          "date" => rota.date.iso8601,
          "status" => rota.status
        })
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
