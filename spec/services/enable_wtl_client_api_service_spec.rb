require "rails_helper"

describe EnableWtlClientApiService, :wtl do
  let!(:wtl_client) { FactoryGirl.create(:wtl_client, status: 1) }

  let(:service) do
    EnableWtlClientApiService.new(wtl_client: wtl_client)
  end

  describe "when enabling wtl client" do
    let!(:result) { service.call }

    it "service response should be valid" do
      expect(result).to be_success
    end

    it "should disable a wtl client" do
      expect(result.wtl_client.enabled?).to eq(true)
    end
  end
end
