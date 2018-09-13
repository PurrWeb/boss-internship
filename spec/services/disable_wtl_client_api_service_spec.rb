require "rails_helper"

describe DisableWtlClientApiService, :wtl do
  let!(:wtl_client) { FactoryGirl.create(:wtl_client, status: 0) }

  let(:service) do
    DisableWtlClientApiService.new(wtl_client: wtl_client)
  end

  describe "when enabling wtl client" do
    let!(:result) { service.call }

    it "service response should be valid" do
      expect(result).to be_success
    end

    it "should disable a wtl client" do
      expect(result.wtl_client.disabled?).to eq(true)
    end
  end
end
