require "rails_helper"

describe EnableWtlClient, :wtl do
  let!(:wtl_client) { FactoryGirl.create(:wtl_client, :disabled) }

  let(:service) do
    EnableWtlClient.new(wtl_client: wtl_client)
  end

  describe "when enabling wtl client" do
    let!(:result) { service.call }

    it "service response should be valid" do
      expect(result).to be_success
    end

    it "should enable a wtl client" do
      expect(result.wtl_client.enabled?).to eq(true)
    end
  end
end
