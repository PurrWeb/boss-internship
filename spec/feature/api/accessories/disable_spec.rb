require "rails_helper"

RSpec.describe "Disable accessory API endpoint", :accessories do
  include Rack::Test::Methods
  include HeaderHelpers
  include ActiveSupport::Testing::TimeHelpers

  before do
    set_authorization_header(access_token.token)
  end
  let(:venue) { FactoryGirl.create(:venue) }
  let(:user) { FactoryGirl.create(:user, :admin) }

  let(:access_token) do
    WebApiAccessToken.new(
      expires_at: 30.minutes.from_now,
      user: user,
    ).persist!
  end
  let(:url) do
    url_helpers.api_v1_accessory_path(accessory)
  end
  let(:response) do
    delete(url, params)
  end

  let(:accessory) do
    FactoryGirl.create(:accessory, venue: venue)
  end

  let(:valid_params) do
    {
      venueId: venue.id,
    }
  end

  context "before call" do
    it "no disabled accessories for venue should exist" do
      accessory.reload
      expect(venue.accessories.disabled.count).to eq(0)
    end
  end

  context "when deliting" do
    let(:params) do
      valid_params
    end

    before do
      response
    end

    it "should return ok status" do
      expect(response.status).to eq(ok_status)
    end

    it "no active accessories for venue should exist after disabling" do
      expect(venue.accessories.enabled.count).to eq(0)
    end

    it "disabled accessory for venue should exist after disabling" do
      expect(venue.accessories.disabled.count).to eq(1)
      expect(venue.accessories.first.disabled?).to eq(true)
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
