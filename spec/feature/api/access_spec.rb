require 'rails_helper'

RSpec.describe 'Api access' do
  include Rack::Test::Methods
  include HeaderHelpers

  describe '#get' do
    let(:url) { url_helpers.get_api_v1_test_index_path }
    let(:staff_member) { FactoryGirl.create(:staff_member) }

    specify 'if no token supplied user should not have access' do
      response = get(url)

      expect(response.status).to eq(unauthorised_status)
    end

    context 'active token supplied' do
      let(:user) { FactoryGirl.create(:user) }
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

      specify 'should have access' do
        response = get(url)

        expect(response.status).to eq(ok_status)
      end
    end

    context 'expired token supplied' do
      let(:user) { FactoryGirl.create(:user) }
      let(:access_token) do
        AccessToken.create!(
          token_type: 'web',
          expires_at: 30.minutes.ago,
          creator: user,
          user: user
        )
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
    let(:url) { url_helpers.post_api_v1_test_index_path }
    let(:staff_member) { FactoryGirl.create(:staff_member) }

    specify 'without token should not have access' do
      response = post(url)
      expect(response.status).to eq(unauthorised_status)
    end

    context 'authenticated user' do
      let(:user) { FactoryGirl.create(:user) }
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
