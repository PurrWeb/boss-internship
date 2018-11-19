require 'rails_helper'

RSpec.describe 'Mark Retake Avatar endpoint' do
  include Rack::Test::Methods
  include HeaderHelpers

  before do
    set_authorization_header(access_token.token)
  end

  let(:staff_member) { FactoryGirl.create(:staff_member) }
  let(:user) { FactoryGirl.create(:user, :dev) }
  let(:access_token) do
    WebApiAccessToken.new(
      expires_at: 30.minutes.from_now,
      user: user
    ).persist!
  end
  let(:url) do
    url_helpers.api_v1_staff_member_mark_retake_avatar_path(staff_member)
  end
  let(:response) do
    post(url, params)
  end
  let(:params) { {} }

  specify 'it should be success' do
    expect(response.status).to eq(ok_status)
  end

  specify 'it should return serialized staff member json' do
    json = JSON.parse(response.body)
    staff_member.reload

    staff_member_json = JSON.parse(Api::V1::StaffMemberProfile::StaffMemberSerializer.new(staff_member).to_json)
    expect(json).to eq(staff_member_json)
    expect(staff_member_json['markedRetakeAvatar']).to eq(true)
  end

  private
  def app
    Rails.application
  end

  def url_helpers
    app.routes.url_helpers
  end

  def ok_status
    200
  end
end
