require 'rails_helper'

RSpec.describe 'Accessory serializer' do
  include Rack::Test::Methods
  include HeaderHelpers
  let(:venue) { FactoryGirl.create(:venue) }
  let(:user) { FactoryGirl.create(:user, :admin, venues: [venue]) }
  let(:access_token) do
    WebApiAccessToken.new(
      expires_at: 30.minutes.from_now,
      user: user
    ).persist!
  end
  let(:params) do
    {
      venueId: venue.id
    }
  end

  before do
    set_authorization_header(access_token.token)
  end

  describe '#show' do
    let(:url) { url_helpers.api_v1_accessories_path(accessory) }
    let(:accessory) do
      FactoryGirl.create(:accessory, venue: venue)
    end

    describe 'response' do
      let(:response) { get(url, params) }

      specify 'should succeed' do
        expect(response.status).to eq(ok_status)
      end

      specify 'should return a json representation of the holiday' do
        json = JSON.parse(response.body)[0]
        expect(json).to eq(json_accessory(accessory))
      end
    end
  end

  private
  def json_accessory(accessory)
    {
      "id" => accessory.id,
      "name" => accessory.name,
      "accessoryType" => accessory.accessory_type,
      "size" => accessory.size,
      "priceCents" => accessory.price_cents,
      "userRequestable" => accessory.user_requestable,
      "enabled" => accessory.enabled?
    }
  end

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
