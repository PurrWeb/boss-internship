require 'rails_helper'

RSpec.describe 'Disable Staff Members' do
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
    url_helpers.disable_api_v1_staff_member_path(staff_member)
  end
  let(:valid_params) do
    {
      never_rehire: never_rehire,
      disable_reason: disable_reason
    }
  end
  let(:never_rehire) { true }
  let(:disable_reason) { "Not very good" }
  let(:response) do
    travel_to now do
      post(url, params)
    end
  end

  before do
    now
    use_dummy_ably_service
    set_authorization_header(access_token.token)
  end

  context 'before call' do
    specify "staff member should be enabled" do
      expect(staff_member).to be_enabled
      expect(staff_member.would_rehire).to eq(true)
      expect(staff_member.disable_reason).to eq(nil)
      expect(staff_member.flagged?).to eq(false)
      expect(staff_member.disabled_by_user).to eq(nil)
    end
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

    it 'should have updated the staff member' do
      staff_member.reload
      expect(staff_member).to be_disabled
      expect(staff_member.disabled_by_user).to eq(user)
      expect(staff_member.disable_reason).to eq(disable_reason)
      expect(staff_member.would_rehire).to eq(!never_rehire)
      expect(staff_member.flagged?).to eq(true)
      expect(staff_member.disabled_at.to_i).to eq(now.to_i)
    end
  end

  context 'validation error' do
    let(:params) { valid_params.merge(disable_reason: '') }

    it 'should return unprocessable_entity status' do
      expect(response.status).to eq(unprocessable_entity_status)
    end

    it 'should return error json' do
      json = JSON.parse(response.body)
      expect(json).to eq({
        "errors" => {
          "disable_reason" => ["can't be blank"]
        }
      })
    end

    it 'should not have updated the staff member' do
      response
      staff_member.reload
      expect(staff_member).to be_enabled
      expect(staff_member.would_rehire).to eq(true)
      expect(staff_member.disable_reason).to eq(nil)
      expect(staff_member.flagged?).to eq(false)
      expect(staff_member.disabled_by_user).to eq(nil)
    end
  end

  context 'server error' do
    let(:params) { valid_params.merge(never_rehire: nil) }

    it 'should return unprocessable_entity status' do
      expect{ response }.to raise_error(RuntimeError, "attempt to parse unsuported string \"\" as boolean")
    end

    it 'should not have updated the staff member' do
      begin
        response
      rescue; end

      staff_member.reload
      expect(staff_member).to be_enabled
      expect(staff_member.would_rehire).to eq(true)
      expect(staff_member.disable_reason).to eq(nil)
      expect(staff_member.flagged?).to eq(false)
      expect(staff_member.disabled_by_user).to eq(nil)
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
