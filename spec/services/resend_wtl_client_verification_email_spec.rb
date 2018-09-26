require "rails_helper"

describe ResendWtlClientVerificationEmail, :wtl do
  let!(:previous_verification_token) { SecureRandom.hex }
  let!(:not_verified_wtl_client) { FactoryGirl.create(:wtl_client, :enabled, verification_token: previous_verification_token) }
  let!(:verified_wtl_client) { FactoryGirl.create(:wtl_client, :enabled, :verified, email: "another@mail.com") }

  let(:service) do
    ResendWtlClientVerificationEmail.new(wtl_client: wtl_client)
  end

  context "before call" do
    it "verification tokens should match" do
      expect(not_verified_wtl_client.verification_token).to eq(previous_verification_token)
    end
  end

  describe "when not verified wtl client" do
    let(:wtl_client) { not_verified_wtl_client }
    let!(:result) { service.call }

    it "service response should be valid" do
      expect(result).to be_success
    end

    it "new token should be created" do
      expect(result.wtl_client.verification_token).to_not eq(previous_verification_token)
    end
  end

  describe "when verified wtl client" do
    let(:wtl_client) { verified_wtl_client }
    let!(:result) { service.call }

    it "service response should not be valid" do
      expect(result).to_not be_success
    end
  end
end
