require "rails_helper"

describe CreateWtlClientApiService, :wtl do
  let!(:wtl_card) { FactoryGirl.create(:wtl_card, number: card_number) }
  let!(:first_name) { "John" }
  let!(:surname) { "Doe" }
  let!(:date_of_birth) { 33.years.ago.to_date }
  let!(:gender) { WtlClient::GENDERS[0] }
  let!(:email) { "some@email.com" }
  let!(:card_number) { "12345" }
  let!(:phone_number) { "555-55-55" }
  let!(:invalid_card_number) { "invalid" }
  let!(:university) { WtlClient::UNIVERSITIES[0] }
  let!(:valid_params) do
    {
      first_name: first_name,
      surname: surname,
      gender: gender,
      email: email,
      date_of_birth: UIRotaDate.format(date_of_birth),
      university: university,
      card_number: card_number,
      phone_number: phone_number,
    }
  end

  let(:service) do
    CreateWtlClientApiService.new(params: params)
  end

  describe "before call" do
    it "should no wtl clients exist" do
      expect(WtlClient.count).to eq(0)
    end
  end

  describe "when valid params given" do
    let(:params) { valid_params }
    let!(:result) { service.call }

    it "service response should be valid" do
      expect(result).to be_success
    end

    it "should create a wtl client" do
      expect(WtlClient.count).to eq(1)
    end

    it "errors from response should be nil" do
      expect(result.api_errors).to eq(nil)
    end

    it "wtl_client from response should be instance of WtlClient" do
      expect(result.wtl_client).to be_an_instance_of(WtlClient)
    end
  end

  describe "when invalid params given" do
    let(:params) { valid_params.merge({first_name: nil, card_number: invalid_card_number}) }
    let!(:result) { service.call }

    it "service response should be invalid" do
      expect(result).to_not be_success
    end

    it "should not create a wtl client" do
      expect(WtlClient.count).to eq(0)
    end

    it "errors from response should be present" do
      expect(result.api_errors).to_not eq(nil)
    end

    it "errors from response should be instance of WtlClientApiErrors" do
      expect(result.api_errors).to be_an_instance_of(WtlClientApiErrors)
    end

    it "wtl_client from response should be instance of WtlClient" do
      expect(result.wtl_client).to be_an_instance_of(WtlClient)
    end
  end
end
