require 'rails_helper'

RSpec.describe 'Disable ID Scanner Key' do
  include Rack::Test::Methods
  include HeaderHelpers

  let(:now) { Time.current }
  let(:dev_user) { FactoryGirl.create(:user, :dev) }
  let(:url) { url_helpers.enable_id_scanner_key_path(id: request_id) }
  let(:request) { post(url, params) }
  let(:make_request) { request }
  let(:response) { request }
  let(:params) { {} }

  before do
    login_as dev_user
  end

  context 'when key exists' do
    let(:existing_api_key) do
      IdScannerAppApiKey.create(
        name: 'Existing Key',
        creator: dev_user,
        disabled_at: now,
        disabled_by_user: dev_user,
      )
    end
    let(:request_id) { existing_api_key.id }

    before do
      existing_api_key
    end

    context 'before call' do
      specify 'key should be disabled' do
        expect(existing_api_key).to_not be_enabled
      end
    end

    context 'after call' do
      before do
        make_request
        existing_api_key.reload
      end

      specify 'should redirect to index page' do
        expect(response.status).to eq(302)
      end

      specify 'key should be enabled' do
        expect(existing_api_key).to be_enabled
      end
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
end
