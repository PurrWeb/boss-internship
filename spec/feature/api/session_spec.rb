require 'rails_helper'

RSpec.describe 'Access token end points' do
  include Rack::Test::Methods
  include ActiveSupport::Testing::TimeHelpers

  let(:now) { Time.now }

  around(:each) do |example|
    travel_to now do
      example.run
    end
  end

  describe 'API access token end point' do
    include Rack::Test::Methods
    include ActiveSupport::Testing::TimeHelpers

    let(:now) { Time.now }

    describe '#api_key' do
      context 'no api key is supplied' do
        let(:url) { url_helpers.api_v1_sessions_path }

        specify 'should fail' do
          expect(post(url).status).to eq(unprocessable_entity_status)
        end
      end

      context 'valid api key is supplied' do
        let(:venue) { FactoryGirl.create(:venue) }
        let(:user) { FactoryGirl.create(:user, venues: [venue]) }
        let(:existing_key) do
          ApiKey.create!(
            venue: venue,
            user: user,
            key_type: ApiKey::BOSS_KEY_TYPE
          )
        end
        let(:api_key) { existing_key }

        let(:url) do
          url_helpers.api_v1_sessions_path(
            api_key: api_key.key,
            staff_member_id: staff_member_id,
            staff_member_pin: staff_member_pin
          )
        end

        before do
          existing_key
        end

        let(:staff_member) do
          FactoryGirl.create(:staff_member, master_venue: venue)
        end
        let(:staff_member_id) { staff_member.id }
        let(:staff_member_pin) { staff_member.pin_code }
        let(:response) { post(url) }

        describe 'pre call' do
          specify do
            expect(
              ApiAccessToken.find_by_api_key(api_key: existing_key).count
            ).to eq(0)
          end
        end

        specify 'should succeed' do
          expect(response.status).to eq(ok_status)
        end

        specify 'access token should be created' do
          post(url)
          access_token = ApiAccessToken.find_by_api_key(api_key: existing_key).first
          expect(access_token).to be_present
          expect(access_token.staff_member).to eq(staff_member)
        end

        specify 'should return an access token' do
          json = JSON.parse(response.body)

          token = ApiAccessToken.find_by_api_key(api_key: existing_key).first
          expect(json).to eq({
            "access_token" => token.token,
            "expires_at" => token.expires_at.utc.iso8601(3),
            "staff_member" => {
              "id" => token.staff_member.id,
              "name" => token.staff_member.full_name,
              "rollbar_guid" => token.staff_member.rollbar_guid
            }
          })
        end

        context 'supplying invalid api key' do
          let(:api_key) { ApiKey.new(key: 'sdadas') }
          specify 'should fail' do
            expect(post(url).status).to eq(unprocessable_entity_status)
          end

          specify 'should return error' do
            json = JSON.parse(post(url).body)
            expect(json).to eq({
              "errors" => {
                "base" => ["API key invalid or inactive"]
              }
            })
          end
        end

        context 'supplying expired api key' do
          before do
            existing_key.state_machine.transition_to!(:deleted, requster_user_id: user.id)
          end

          specify 'should fail' do
            expect(post(url).status).to eq(unprocessable_entity_status)
          end

          specify 'should return error' do
            json = JSON.parse(post(url).body)
            expect(json).to eq({
              "errors" => {
                "base" => ["API key invalid or inactive"]
              }
            })
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

          specify 'should return error' do
            json = JSON.parse(post(url).body)
            expect(json).to eq({
              "errors" => {
                "base" => ["staff member invalid or inactive"]
              }
            })
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

          specify 'should return error' do
            json = JSON.parse(post(url).body)
            expect(json).to eq({
              "errors" => {
                "base" => ["wrong pin"]
              }
            })
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
