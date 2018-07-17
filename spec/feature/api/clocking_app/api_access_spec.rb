require 'rails_helper'

RSpec.describe 'Clocking App Api access' do
  include Rack::Test::Methods
  include HeaderHelpers

  let(:venue) { FactoryGirl.create(:venue) }
  let(:user) { FactoryGirl.create(:user, venues: [venue]) }
  let(:api_key) do
    ApiKey.create!(venue: venue, user: user, key_type: ApiKey::BOSS_KEY_TYPE)
  end

  describe '#get' do
    let(:url) { url_helpers.get_api_clocking_app_v1_tests_path }
    let(:staff_member) { FactoryGirl.create(:staff_member) }

    specify 'if no token supplied user should not have access' do
      response = get(url)

      expect(response.status).to eq(unauthorised_status)
    end

    context ' staff member active token supplied' do
      let(:staff_member) { FactoryGirl.create(:staff_member, verified_at: Time.now.utc) }
      let(:access_token) do
        ClockingAppApiAccessToken.new(
          staff_member: staff_member,
          api_key: api_key
        ).persist!
      end

      before do
        set_authorization_header(access_token.token)
      end

      specify 'should have access' do
        response = get(url)

        expect(response.status).to eq(ok_status)
      end
    end

    context 'expired token supplied' do
      let(:staff_member) { FactoryGirl.create(:staff_member, verified_at: Time.now.utc) }
      let(:access_token) do
        ClockingAppApiAccessToken.new(
          staff_member: staff_member,
          api_key: api_key
        ).persist!
      end

      before do
        access_token
      end

      specify 'should not have access' do
        response = get(url)

        expect(response.status).to eq(unauthorised_status)
      end
    end
  end

  describe '#post' do
    let(:url) { url_helpers.post_api_clocking_app_v1_tests_path }
    let(:staff_member) { FactoryGirl.create(:staff_member) }

    specify 'without token should not have access' do
      response = post(url)
      expect(response.status).to eq(unauthorised_status)
    end

    context 'authenticated user' do
      let(:staff_member) { FactoryGirl.create(:staff_member, verified_at: Time.now.utc) }
      let(:access_token) do
        ClockingAppApiAccessToken.new(
          staff_member: staff_member,
          api_key: api_key
        ).persist!
      end

      before do
        set_authorization_header(access_token.token)
      end

      specify 'should have access' do
        response = post(url)
        expect(response.status).to eq(ok_status)
      end

      specify 'supplied json values should be passed to the app' do
        message = 'hi there'
        response = post(url, { message: message })

        expect(
          JSON.parse(response.body)
        ).to eq(
          {
            "message" => message
          }
        )
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
