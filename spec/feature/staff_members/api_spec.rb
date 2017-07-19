require 'rails_helper'

RSpec.describe 'Staff member pages access' do
  include Rack::Test::Methods
  include HeaderHelpers

  let(:user) { FactoryGirl.create(:user, venues: [staff_member.master_venue]) }
  let(:access_token) do
    WebApiAccessToken.new(
      expires_at: 30.minutes.from_now,
      user: user
    ).persist!
  end
  let(:staff_member) { FactoryGirl.create(:staff_member) }

  before do
    set_authorization_header(access_token.token)
  end

  specify do
    response = get(url_helpers.api_v1_staff_member_path(staff_member), {}, json_request_env)
    expect(response.status).to eq(200)
  end

  private
  def app
    Rails.application
  end

  def url_helpers
    Rails.application.routes.url_helpers
  end

  def json_request_env
    { "CONTENT_TYPE" => "application/json" }
  end
end
