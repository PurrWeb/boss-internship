require 'rails_helper'

RSpec.describe 'Security Session spec' do
  include Rack::Test::Methods
  include HeaderHelpers

  let(:venue) { FactoryGirl.create(:venue) }
  let(:user) { FactoryGirl.create(:user, venues: [venue]) }
  let(:api_key) do
    ApiKey.create!(venue: venue, user: user, key_type: ApiKey::BOSS_KEY_TYPE)
  end

  let(:url) { url_helpers.api_clocking_app_v1_sessions_path }
  let(:pin_code) { '12345' }
  let(:staff_member) do
    FactoryGirl.create(:staff_member, pin_code: pin_code)
  end
  let(:response) { post(url, params)}
  # default in staff member factory
  let(:params) do
    {
      apiKey: api_key.key,
      staffMemberId: staff_member.id,
      pincode: pin_code,
    }
  end

  specify 'should have access' do
    expect(response.status).to eq(ok_status)
  end

  specify 'return token and staff member' do
    expected_auth_token = "expected__auth_token__string"

    mock_access_token = double('Mock access token')
    mock_auth_token_service = double('Mock auth token service')
    allow(ClockingAppApiAccessToken).to receive(:new).with(staff_member: staff_member, api_key: api_key).and_return(mock_auth_token_service)
    allow(mock_auth_token_service).to receive(:persist!).and_return(mock_access_token)
    allow(mock_access_token).to receive(:token).and_return(expected_auth_token)

    json_response = JSON.parse(response.body)

    expect(json_response).to eq({
      "accessToken" => expected_auth_token,
      "staffMember" => {
        "id" => staff_member.id,
        "name" => staff_member.full_name
      }
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
