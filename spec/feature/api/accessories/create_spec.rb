require "rails_helper"

RSpec.describe "Create accessory API endpoint", :accessories do
  include Rack::Test::Methods
  include HeaderHelpers
  include ActiveSupport::Testing::TimeHelpers

  before do
    set_authorization_header(access_token.token)
  end
  let(:venue) { FactoryGirl.create(:venue) }
  let(:user) { FactoryGirl.create(:user, :admin) }
  let(:accessory_misc_type) do
    "misc"
  end
  let(:accessory_uniform_type) do
    "uniform"
  end
  let(:name) do
    "Some name"
  end
  let(:price_cents) do
    3530
  end
  let(:nil_size) do
    nil
  end
  let(:size) do
    "S,M,L,XL"
  end
  let(:now) { Time.current }
  let(:access_token) do
    WebApiAccessToken.new(
      expires_at: 30.minutes.from_now,
      user: user,
    ).persist!
  end
  let(:url) do
    url_helpers.api_v1_accessories_path
  end
  let(:response) do
    post(url, params)
  end
  let(:valid_params) do
    {
      venueId: venue.id,
      name: name,
      accessoryType: accessory_misc_type,
      size: nil_size,
      priceCents: price_cents,
      userRequestable: false,
    }
  end

  context "before call" do
    it "no accessories should exist" do
      expect(venue.accessories.count).to eq(0)
    end
  end

  context "creating accessory for venue" do
    context " with valid params" do
      let(:params) do
        valid_params
      end

      before do
        response
      end

      it "should return ok status" do
        expect(response.status).to eq(ok_status)
      end

      it "it should create accessory" do
        expect(venue.accessories.count).to eq(1)
        expect(venue.accessories.first.name).to eq(name)
        expect(venue.accessories.first.accessory_type).to eq(accessory_misc_type)
        expect(venue.accessories.first.price_cents).to eq(price_cents)
        expect(venue.accessories.first.size).to eq(nil_size)
        expect(venue.accessories.first.user_requestable).to eq(false)
      end

      it "it should return created accessory" do
        json = JSON.parse(response.body)
        expect(json["id"]).to eq(venue.accessories.first.id)
        expect(json["name"]).to eq(venue.accessories.first.name)
        expect(json["priceCents"]).to eq(venue.accessories.first.price_cents)
        expect(json["accessoryType"]).to eq(accessory_misc_type)
        expect(json["size"]).to eq(nil_size)
        expect(json["userRequestable"]).to eq(false)
      end
    end

    context " with empty params" do
      let(:params) do
        valid_params.merge({
          name: "",
          accessoryType: "",
        })
      end

      before do
        response
      end

      it "should return unprocessable_entity status" do
        expect(response.status).to eq(unprocessable_entity_status)
      end

      it 'it shouldn\'t create accessory' do
        expect(venue.accessories.count).to eq(0)
      end

      it "should return errors json" do
        json = JSON.parse(response.body)
        expect(json).to eq({
          "errors" => {
            "name" => ["can't be blank"],
            "accessoryType" => ["can't be blank"],
          },
        })
      end
    end

    context " with invalid params" do
      let(:params) do
        valid_params.merge({
          accessoryType: accessory_uniform_type,
          size: "",
        })
      end

      before do
        response
      end

      it "should return unprocessable_entity status" do
        expect(response.status).to eq(unprocessable_entity_status)
      end

      it 'it shouldn\'t create accessory' do
        expect(venue.accessories.count).to eq(0)
      end

      it "should return errors json" do
        json = JSON.parse(response.body)
        expect(json).to eq({
          "errors" => {
            "size" => ["can't be blank"],
          },
        })
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
