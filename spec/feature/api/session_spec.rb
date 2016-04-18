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

  describe 'API access token end point' do
    include Rack::Test::Methods
    include ActiveSupport::Testing::TimeHelpers

    let(:now) { Time.now }

    describe '#api_key' do
      describe 'pre call' do
        specify do
          expect(AccessToken.count).to eq(0)
        end
      end

      context 'no api key is supplied' do
        let(:url) { url_helpers.api_key_api_v1_sessions_path }

        specify 'should fail' do
          expect(post(url).status).to eq(unprocessable_entity_status)
        end
      end

      context 'api key is supplied' do
        let(:venue) { FactoryGirl.create(:venue) }
        let(:user) { FactoryGirl.create(:user, venues: [venue]) }
        let(:existing_key) { ApiKey.create!(venue: venue, user: user) }

        let(:url) do
          url_helpers.api_key_api_v1_sessions_path(
            api_key: api_key,
            staff_member_id: staff_member_id,
            staff_member_pin: staff_member_pin
          )
        end

        before do
          existing_key
        end

        let(:staff_member) do
          FactoryGirl.create(:staff_member, venues: [venue])
        end
        let(:staff_member_id) { staff_member.id }
        let(:staff_member_pin) { staff_member.pin_code }
        let(:api_key) { existing_key.key }
        let(:response) { post(url) }

        specify 'should succeed' do
          expect(response.status).to eq(ok_status)
        end

        specify 'access token should be created' do
          post(url)
          access_token = AccessToken.first
          expect(access_token).to be_present
          expect(access_token.staff_member).to eq(staff_member)
        end

        specify 'should return an access token' do
          json = JSON.parse(response.body)
          token = AccessToken.find_by(staff_member: staff_member)
          expect(json).to eq({
            "access_token" => token.token,
            "expires_at" => token.expires_at.utc.iso8601.to_s
          })
        end

        context 'supplying invalid api key' do
          let(:api_key) { 'sdadas' }

          specify 'should fail' do
            expect(post(url).status).to eq(unprocessable_entity_status)
          end
        end

        context 'supplying invalid staff_member_id' do
          let(:staff_member_id) { 40 }

          specify 'id should not be valid' do
            expect(staff_member_id).to_not eq(staff_member.id)
          end

          specify 'should fail' do
            expect(post(url).status).to eq(unprocessable_entity_status)
          end
        end

        context 'supplying invalid pin' do
          let(:staff_member_pin) { '32443243' }

          specify 'id should not be valid' do
            expect(staff_member_pin).to_not eq(staff_member.pin_code)
          end

          specify 'should fail' do
            expect(post(url).status).to eq(unprocessable_entity_status)
          end
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
