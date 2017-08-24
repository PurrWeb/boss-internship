require 'rails_helper'

RSpec.describe 'Rota Weekly Day Data #Index API endpoint' do
  include Rack::Test::Methods
  include ActiveSupport::Testing::TimeHelpers
  include HeaderHelpers

  let(:rota_shift) { FactoryGirl.create(:rota_shift) }
  let(:venue) { rota_shift.rota.venue }
  let(:user) { FactoryGirl.create(:user, :admin) }
  let(:another_user) { FactoryGirl.create(:user) }
  let(:access_token) do
    WebApiAccessToken.new(
      expires_at: 30.minutes.from_now,
      user: user
    ).persist!
  end
  
  let(:another_access_token) do
    WebApiAccessToken.new(
      expires_at: 30.minutes.from_now,
      user: another_user
    ).persist!
  end
  
  let(:url) do
    url_helpers.api_v1_rota_weekly_day_data_path
  end

  let(:response) do
    get(url, params)
  end

  let(:valid_params) do
    {
      date: UIRotaDate.format(Time.current),
      venue_id: venue.id,
    }
  end

  let(:invalid_params) do
    {
      date: UIRotaDate.format(Time.current),
      gibberish: 'gibberish'
    }
  end

  before do
    set_authorization_header(access_token.token)
  end

  context 'show rota weekly day data' do
    context ' with valid params' do
      let(:params) do
        valid_params
      end
      
      before do
        response
      end
  
      it 'should return ok status' do
        expect(response.status).to eq(ok_status)
      end

      it 'should return valid json' do
        json = JSON.parse(response.body)
      end

      it 'should return security error' do
        set_authorization_header(another_access_token.token)
        response
        expect(response.status).to eq(200)
      end

    end
    context ' with invalid params' do
      let(:params) do
        invalid_params
      end
      
      before do
        response
      end
  
      it 'should return 422 status' do
        expect(response.status).to eq(unprocessable_entity_status)
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

  def unprocessable_entity_status
    422
  end
end
