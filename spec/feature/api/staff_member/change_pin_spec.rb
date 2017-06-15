require 'rails_helper'

RSpec.describe 'Api access' do
  include Rack::Test::Methods
  include HeaderHelpers

  let(:staff_member) { FactoryGirl.create(:staff_member) }
  let(:venue) { staff_member.master_venue }

  def security_staff_with_venue?(staff_member)
    staff_member.staff_type.security? &&
      staff_member.venues.length > 0
  end

  def non_security_staff_without_venue?(staff_member)
    !staff_member.staff_type.security? &&
      staff_member.venues.length == 0
  end
  let(:api_key) do
    ApiKey.create!(
      venue: venue,
      user: user,
      key_type: ApiKey::BOSS_KEY_TYPE
    )
  end
  let(:user) { FactoryGirl.create(:user, venues: [venue]) }
  let(:access_token) do
    AccessToken.create!(
      token_type: 'web',
      expires_at: 30.minutes.from_now,
      creator: user,
      user: user
    )
  end

  before do
    set_authorization_header(access_token.token)
  end

  let(:user) do
    FactoryGirl.create(
      :user
    )
  end
  let(:user_staff_member) do
    FactoryGirl.create(
      :staff_member,
      user: user,
      staff_type: manager_staff_type
    )
  end
  let(:manager_staff_type) do
    FactoryGirl.create(
      :manager_staff_type
    )
  end
  let(:access_token) do
    AccessToken.create(
      token_type: 'api',
      expires_at: 30.minutes.from_now,
      creator: api_key,
      api_key: api_key,
      staff_member: user_staff_member
    )
  end
  let(:old_pin) { '123456778' }
  let(:staff_member) {
    FactoryGirl.create(
      :staff_member,
      pin_code: old_pin
    )
  }
  let(:url) { url_helpers.change_pin_api_v1_staff_member_path(staff_member) }
  let(:new_pin) { '7832432'}
  let(:params) do
    {
      pin_code: new_pin
    }
  end

  before do
    user_staff_member
    staff_member
  end

  specify 'it should be success' do
    response = post(url, params)
    expect(response.status).to eq(ok_status)
  end

  specify 'it should change staff members pin' do
    post(url, params)
    expect(staff_member.reload.pin_code_valid?(new_pin)).to eq(true)
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
