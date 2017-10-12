require 'rails_helper'

RSpec.describe 'Voucher creation endpoint' do
  include Rack::Test::Methods
  include HeaderHelpers

  let(:api_key) do
    ApiKey.create!(
      venue: venue,
      user: user,
      key_type: ApiKey::BOSS_KEY_TYPE
    )
  end
  let(:user) { FactoryGirl.create(:user, venues: [venue]) }
  let(:creator) { user }
  let(:venue) { FactoryGirl.create(:venue) }
  let(:access_token) do
    WebApiAccessToken.new(
      expires_at: 30.minutes.from_now,
      user: user
    ).persist!
  end
  let(:valid_params) do
    {
      description: description
    }
  end
  let(:response) { post(url, params) }
  let(:description) { '20 percent off Beer' }

  before do
    set_authorization_header(access_token.token)
  end

  describe '#create' do
    let(:url) do
      url_helpers.api_v1_vouchers_path(venue_id: venue.id)
    end

    describe "before call" do
      specify 'no vouchers exist' do
        expect(Voucher.count).to eq(0)
      end
    end

    describe 'call' do
      let(:perform_call) { response}

      context 'when params valid' do
        let(:params) { valid_params }

        specify 'should succeed' do
          expect(response.status).to eq(ok_status)
        end

        specify 'should create 1 voucher' do
          perform_call
          expect(Voucher.count).to eq(1)
          created_voucher = Voucher.first

          expect(created_voucher.description).to eq(description)
          expect(created_voucher.creator.id).to eq(creator.id)
          expect(created_voucher.enabled).to eq(true)
        end

        specify 'should return voucher id' do
          response_json = JSON.parse(response.body)

          created_voucher = Voucher.first
          expect(response_json).to eq({
            "id" => created_voucher.id,
            "enabled" => true,
            "description" => description,
            "usages" => 0,
            "venue_name" => venue.name
          })
        end

        context 'call format wrong' do
          let(:params) { {} }

          specify 'should succeed' do
            expect { perform_call }.to raise_error(ActionController::ParameterMissing)
          end
        end

        context 'param invalid' do
          let(:empty_description) { '' }
          let(:params) do
            valid_params.merge(description: empty_description)
          end

          specify 'should succeed' do
            expect(response.status).to eq(unprocessible_entity_status)
          end

          specify 'should return errors in api format' do
            response_json = JSON.parse(response.body)

            expect(response_json).to eq({
              "errors" => {
                "description" => ["can't be blank"]
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

  def unprocessible_entity_status
    422
  end
end
