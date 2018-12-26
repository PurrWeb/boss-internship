require 'rails_helper'

RSpec.describe 'ID Scanner App Api access' do
  include Rack::Test::Methods
  include HeaderHelpers

  let(:user) { FactoryGirl.create(:user, :dev) }
  let(:id_scanner_app_api_key) do
    IdScannerAppApiKey.create!(
      name: 'test key',
      creator: user
    )
  end

  describe '#get' do
    let(:url) { url_helpers.get_api_id_scanner_app_v1_tests_path }

    specify 'if no key supplied user should not have access' do
      response = get(url)

      expect(response.status).to eq(unauthorised_status)
    end

    context ' staff member active key supplied' do
      before do
        set_authorization_header(id_scanner_app_api_key.key)
      end

      specify 'should have access' do
        response = get(url)

        expect(response.status).to eq(ok_status)
      end
    end

    context 'disabled api key used' do
      before do
        id_scanner_app_api_key
      end

      specify 'should not have access' do
        response = get(url)

        expect(response.status).to eq(unauthorised_status)
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
end
