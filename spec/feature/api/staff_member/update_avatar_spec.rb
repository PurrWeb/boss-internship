require 'rails_helper'
require 'base64'

RSpec.describe 'Update Staff Member Avatar' do
  include Rack::Test::Methods
  include HeaderHelpers
  include ActiveSupport::Testing::TimeHelpers

  let(:staff_member) { FactoryGirl.create(:staff_member) }
  let(:venue) { staff_member.master_venue }
  let(:user) { FactoryGirl.create(:user, venues: [venue]) }
  let(:api_key) do
    ApiKey.create!(
      venue: venue,
      user: user,
      key_type: ApiKey::BOSS_KEY_TYPE
    )
  end
  let(:access_token) do
    WebApiAccessToken.new(
      expires_at: 30.minutes.from_now,
      user: user
    ).persist!
  end
  let(:now) { Time.current }
  let(:url) do
    url_helpers.update_avatar_api_v1_staff_member_path(staff_member)
  end

  let(:new_base64_avatar_image) do
    "data:image/jpg;base64," +
    Base64.encode64(
      File.open(TestImageHelper.square_arnie_face_path){ |io| io.read }
    )
  end
  let(:valid_params) do
    {
      avatar_base64: new_base64_avatar_image
    }
  end
  let(:response) do
    travel_to now do
      post(url, params)
    end
  end
  let(:old_avatar_url) { staff_member.avatar_url }

  before do
    old_avatar_url
    use_dummy_ably_service
    set_authorization_header(access_token.token)
  end

  context 'when valid params supplied' do
    let(:params) do
      valid_params
    end

    before do
      response
    end

    it 'should return ok status' do
      expect(response.status).to eq(ok_status)
    end

    it 'should return staff member json' do
      staff_member.reload

      response_json = JSON.parse(response.body)
      expect(response_json).to eq(
        JSON.parse(
          Api::V1::StaffMemberProfile::StaffMemberSerializer.new(staff_member).to_json
        )
      )
    end

    it 'should have updated the avatar' do
      #TODO: Figure out how to test it updated correctly
      staff_member.reload
      expect(staff_member.avatar_url).to_not eq(old_avatar_url)
    end
  end

  context 'when validation error occurs' do
    let(:params) do
      valid_params.merge({
        avatar_base64: Base64.encode64(File.open(TestImageHelper.large_image_path).read)
      })
    end

    pending 'should return unprocessable_entity status' do
      expect(response.status).to eq(unprocessable_entity_status)
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
