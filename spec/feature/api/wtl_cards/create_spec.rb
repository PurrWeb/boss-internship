require "rails_helper"

RSpec.describe "Create wtl card API endpoint" do
  include Rack::Test::Methods
  include HeaderHelpers

  before do
    set_authorization_header(access_token.token)
  end
  let(:now) { Time.current }
  let(:user) { FactoryGirl.create(:user, :admin) }
  let(:access_token) do
    WebApiAccessToken.new(
      expires_at: 30.minutes.from_now,
      user: user,
    ).persist!
  end
  let!(:number) { "123456" }
  let!(:default_state) { WtlCard.states.keys[0] }

  let!(:valid_params) do
    {
      number: number,
    }
  end

  let(:url) do
    url_helpers.api_v1_wtl_cards_path
  end

  let(:response) do
    post(url, params)
  end

  describe "before call" do
    it "no wtl cards should exist" do
      expect(WtlCard.count).to eq(0)
    end
  end

  describe "create wtl card" do
    describe "with valid params" do
      let(:params) do
        valid_params
      end

      before do
        response
      end

      it "should return ok status" do
        expect(response.status).to eq(ok_status)
      end

      it "it should create wtl card" do
        create_wtl_card = WtlCard.first
        expect(WtlCard.count).to eq(1)
        expect(create_wtl_card.number).to eq(number)
        expect(create_wtl_card.state).to eq(default_state)
      end

      it "it should return created wtl card" do
        json = JSON.parse(response.body)
        wtl_card_json = json.fetch("wtlCard")
        created_wtl_card = WtlCard.first
        expect(wtl_card_json["id"]).to eq(created_wtl_card.id)
        expect(wtl_card_json["number"]).to eq(created_wtl_card.number)
        expect(wtl_card_json["disabled"]).to eq(true)
      end
    end

    describe "with empty params" do
      let(:params) do
        valid_params.merge({
          number: nil,
        })
      end

      before do
        response
      end

      it "should return unprocessable_entity status" do
        expect(response.status).to eq(unprocessable_entity_status)
      end

      it "it shouldn\'t create wtl card" do
        expect(WtlClient.count).to eq(0)
      end

      it "should return errors json" do
        json = JSON.parse(response.body)
        expect(json).to eq({
          "errors" => {
            "number" => ["can't be blank"],
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
