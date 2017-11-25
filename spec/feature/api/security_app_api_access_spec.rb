require 'rails_helper'

RSpec.describe 'Security App Api access' do
  include Rack::Test::Methods
  include HeaderHelpers

  describe '#get' do
    let(:url) { url_helpers.get_api_security_app_v1_tests_path }
    let(:staff_member) { FactoryGirl.create(:staff_member) }

    specify 'if no token supplied user should not have access' do
      response = get(url)

      expect(response.status).to eq(unauthorised_status)
    end

    context 'unverified staff member trying supply token' do
      let(:staff_member) { FactoryGirl.create(:staff_member) }
      let(:access_token) do
        SecurityAppApiAccessToken.new(
          staff_member: staff_member
        ).persist!
      end

      it 'should raise error' do
        response = get(url)
        expect{ access_token }.to raise_error(RuntimeError, "Staff member with id: #{staff_member.id} not verified yet")
      end
    end

    context 'verified staff member active token supplied' do
      let(:staff_member) { FactoryGirl.create(:staff_member, verified_at: Time.now.utc) }
      let(:access_token) do
        SecurityAppApiAccessToken.new(
          staff_member: staff_member
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
        SecurityAppApiAccessToken.new(
          staff_member: staff_member
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
    let(:url) { url_helpers.post_api_security_app_v1_tests_path }
    let(:staff_member) { FactoryGirl.create(:staff_member) }

    specify 'without token should not have access' do
      response = post(url)
      expect(response.status).to eq(unauthorised_status)
    end

    context 'authenticated user' do
      let(:staff_member) { FactoryGirl.create(:staff_member, verified_at: Time.now.utc) }
      let(:access_token) do
        SecurityAppApiAccessToken.new(
          staff_member: staff_member
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
