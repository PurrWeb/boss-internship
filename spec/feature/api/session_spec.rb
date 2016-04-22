require 'rails_helper'

RSpec.describe 'Access token end points' do
  describe 'web app endpoint' do
    include Rack::Test::Methods
    include ActiveSupport::Testing::TimeHelpers

    let(:now) { Time.now }

    around(:each) do |example|
      travel_to now do
        example.run
      end
    end

    context 'user is not logged in' do
      let(:url) { url_helpers.api_v1_sessions_path }

      describe 'response' do
        let(:response) { post(url) }

        specify 'should return unprocessable entity' do
          expect(response.status).to eq(unprocessable_entity_status)
        end

        specify 'should not create access token' do
          post(url)
          expect(AccessToken.count).to eq(0)
        end
      end
    end

    context 'user is logged in' do
      let(:user) { FactoryGirl.create(:user) }
      let(:url) { url_helpers.api_v1_sessions_path }

      before do
        login_as user
      end

      describe 'pre call' do
        specify 'no access tokens exist' do
          expect(AccessToken.count).to eq(0)
        end
      end

      describe 'response' do
        let(:response) { post(url) }

        specify 'should succeed' do
          expect(response.status).to eq(ok_status)
        end

        specify 'should create access token for user expiring in 30 minutes' do
          post(url)
          token = AccessToken.find_by(user: user)
          expect(token.present?).to eq(true)
          expect(token.creator).to eq(user)
          expect(token.user).to eq(user)
          expect(token.expires_at).to eq(30.minutes.from_now)
        end

        specify 'should return an access token' do
          json = JSON.parse(response.body)
          token = AccessToken.find_by(user: user)
          expect(json).to eq({
            "access_token" => token.token,
            "expires_at" => token.expires_at.utc.iso8601.to_s
          })
        end
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

  def unprocessable_entity_status
    422
  end
end
