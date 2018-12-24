require 'rails_helper'

RSpec.describe 'Id Scanner scan spec' do
  include Rack::Test::Methods
  include ActiveSupport::Testing::TimeHelpers

  let(:now) { Time.current }
  let(:rota_shift_date) { RotaShiftDate.new(now) }
  let(:start_of_day) { rota_shift_date.start_time }
  let(:user) { FactoryGirl.create(:user) }
  let(:url) { url_helpers.api_id_scanner_app_v1_auth_path }
  let(:response) { post(url, params) }
  let(:perform_call) { response }
  let(:existing_api_key) do
    IdScannerAppApiKey.create!(
      name: 'Valid Key',
      creator: user
    )
  end

  before do
    existing_api_key
  end

  context "supplied api key is valid" do
    let(:params) do
      { "apiKey" => existing_api_key.key }
    end

    specify "should be success" do
      expect(response.status).to eq(ok_status)
    end

    specify 'should return empty response' do
      response_json = JSON.parse(response.body)
      expect(response_json).to eq({})
    end
  end

  context "supplied api key doesn't exist" do
    let(:params) do
      { "apiKey" => "non_existant_api_key" }
    end

    specify 'should not succeed' do
      expect(response.status).to eq(unauthorised_status)
    end

    specify 'return empty response' do
      json_response = JSON.parse(response.body)
      expect(json_response).to eq({})
    end
  end

  context "supplied api key is disabled" do
    let(:disabled_api_key) do
      IdScannerAppApiKey.create!(
        name: 'My Key',
        creator: user,
        disabled_by_user: user,
        disabled_at: now,
      )
    end

    let(:params) do
      { "apiKey" => disabled_api_key.key }
    end

    specify "should be success" do
      expect(response.status).to eq(unauthorised_status)
    end

    specify 'should return empty response' do
      response_json = JSON.parse(response.body)
      expect(response_json).to eq({})
    end
  end

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

  def bad_request_status
    403
  end
end
