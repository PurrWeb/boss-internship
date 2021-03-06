require "rails_helper"

RSpec.describe "Create wtl client API endpoint", :wtl do
  include Rack::Test::Methods
  include HeaderHelpers

  let!(:wtl_card) { FactoryGirl.create(:wtl_card, number: card_number) }
  let!(:first_name) { "John" }
  let!(:surname) { "Doe" }
  let!(:date_of_birth) { 33.years.ago.to_date }
  let!(:university) { WtlClient::UNIVERSITIES[0] }
  let!(:wrong_university) { "Wrong university" }
  let!(:gender) { WtlClient::GENDERS[0] }
  let!(:wrong_gender) { "Wrong gender" }
  let!(:email) { "some@email.com" }
  let!(:phone_number) { "555-55-55" }
  let!(:wrong_email) { "somewrongemail.com" }
  let!(:existing_card_number) { "123456" }
  let!(:card_number) { "123457" }
  let!(:wrong_card_number) { "Wrong card number" }

  let!(:valid_params) do
    {
      firstName: first_name,
      surname: surname,
      dateOfBirth: UIRotaDate.format(date_of_birth),
      university: university,
      gender: gender,
      email: email,
      phoneNumber: phone_number,
      cardNumber: card_number,
    }
  end

  let(:url) do
    url_helpers.api_wtl_v1_wtl_clients_path
  end

  let(:response) do
    post(url, params)
  end

  describe "before call" do
    it "no wtl clients should exist" do
      expect(WtlClient.count).to eq(0)
    end
  end

  describe "create wtl client" do
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

      it "it should create wtl client" do
        create_wtl_client = WtlClient.first
        expect(WtlClient.count).to eq(1)
        expect(create_wtl_client.first_name).to eq(first_name)
        expect(create_wtl_client.surname).to eq(surname)
        expect(create_wtl_client.gender).to eq(gender)
        expect(create_wtl_client.email).to eq(email)
        expect(create_wtl_client.university).to eq(university)
        expect(create_wtl_client.card_number).to eq(card_number)
        expect(create_wtl_client.phone_number).to eq(phone_number)
      end

      it "it should return created wtl client" do
        json = JSON.parse(response.body)
        wtl_client_json = json.fetch("wtlClient")
        create_wtl_client = WtlClient.first
        expect(wtl_client_json["id"]).to eq(create_wtl_client.id)
        expect(wtl_client_json["firstName"]).to eq(create_wtl_client.first_name)
        expect(wtl_client_json["surname"]).to eq(create_wtl_client.surname)
        expect(wtl_client_json["gender"]).to eq(create_wtl_client.gender)
        expect(wtl_client_json["email"]).to eq(create_wtl_client.email)
        expect(wtl_client_json["university"]).to eq(create_wtl_client.university)
        expect(wtl_client_json["cardNumber"]).to eq(create_wtl_client.wtl_card.number)
        expect(wtl_client_json["phoneNumber"]).to eq(create_wtl_client.phone_number)
      end
    end

    describe "with empty params" do
      let(:params) do
        valid_params.merge({
          firstName: nil,
          surname: nil,
          dateOfBirth: nil,
          email: nil,
          gender: nil,
          university: nil,
          cardNumber: nil,
          phoneNumber: nil,
        })
      end

      before do
        response
      end

      it "should return unprocessable_entity status" do
        expect(response.status).to eq(unprocessable_entity_status)
      end

      it 'it shouldn\'t create wtl client' do
        expect(WtlClient.count).to eq(0)
      end

      it "should return errors json" do
        json = JSON.parse(response.body)
        expect(json).to eq({
          "errors" => {
            "firstName" => ["can't be blank"],
            "surname" => ["can't be blank"],
            "gender" => ["a valid gender should be present"],
            "dateOfBirth" => ["can't be blank"],
            "email" => ["can't be blank"],
            "university" => ["a valid university should be present"],
            "cardNumber" => ["can't be blank"],
            "phoneNumber" => ["can't be blank"],
          },
        })
      end
    end

    context "with invalid params" do
      let(:params) do
        valid_params.merge({
          email: wrong_email,
          cardNumber: wrong_card_number,
          gender: wrong_gender,
          university: wrong_university,
        })
      end

      before do
        response
      end

      it "should return unprocessable_entity status" do
        expect(response.status).to eq(forbidden_status)
      end

      it 'it shouldn\'t create wtl client' do
        expect(WtlClient.count).to eq(0)
      end

      it "should return errors json" do
        json = JSON.parse(response.body)
        expect(json).to eq({
          "errors" => {
            "headline" => "Card or email problem!",
            "descirption" => "This card could not be registered because there was a problem with your card or email address.",
          },
        })
      end
    end

    context "with your already assigned card" do
      let!(:existing_wtl_card) { FactoryGirl.create(:wtl_card, number: existing_card_number) }
      let!(:existing_wtl_client) { FactoryGirl.create(:wtl_client, wtl_card: existing_wtl_card) }

      let(:params) do
        valid_params.merge({
          cardNumber: existing_card_number,
        })
      end

      before do
        response
      end

      it "should return unprocessable_entity status" do
        expect(response.status).to eq(forbidden_status)
      end

      it 'it shouldn\'t create wtl client' do
        expect(WtlClient.count).to eq(1)
      end

      it "should return errors json" do
        json = JSON.parse(response.body)
        expect(json).to eq({
          "errors" => {
            "headline" => "Already registered!",
            "descirption" => "You are already registered. Verify your email address by visting the link in your verification email to complete the process and use your card.",
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

  def forbidden_status
    403
  end
end
