require 'rails_helper'

RSpec.describe 'Security Session spec' do
  include Rack::Test::Methods
  include HeaderHelpers

  let(:url) { url_helpers.api_security_app_v1_sessions_path }
  let(:staff_member) do
    FactoryGirl.create(:staff_member, :security, :with_password)
  end
  let(:response) { post(url, params)}
  # default in staff member factory
  let(:password) { 'password' }
  let(:params) do
    {
      username: staff_member.email,
      password: password
    }
  end

  specify 'should have access' do
    expect(response.status).to eq(ok_status)
  end

  specify 'return token and expiry date' do
    expected_auth_token = "expected__auth_token__string"
    expected_renew_token = "expected__renew_token__string"
    expected_expires_at = Time.current + 2.days

    mock_renew_token = double('Mock renew token')
    mock_renew_token_service = double("Mock renew token service")
    allow(SecurityAppApiRenewToken).to(
      receive(:issue_new_token!).
        with(staff_member).
        and_return(mock_renew_token)
    )
    allow(mock_renew_token).to receive(:token).and_return(expected_renew_token)


    mock_access_token = double('Mock access token')
    mock_auth_token_service = double('Mock auth token service')
    allow(SecurityAppApiAccessToken).to receive(:new).with(staff_member: staff_member).and_return(mock_auth_token_service)
    allow(mock_auth_token_service).to receive(:persist!).and_return(mock_access_token)
    allow(mock_access_token).to receive(:token).and_return(expected_auth_token)
    allow(mock_access_token).to receive(:expires_at).and_return(expected_expires_at)

    json_response = JSON.parse(response.body)

    expect(json_response).to eq({
      "authToken" => expected_auth_token,
      "expiresAt" => expected_expires_at.utc.iso8601,
      "renewToken" => expected_renew_token
    })
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
