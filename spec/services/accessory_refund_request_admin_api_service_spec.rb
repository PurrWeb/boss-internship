require "rails_helper"

RSpec.describe "AccessoryRefundRequestAdminApiService" do
  let(:now) { Time.current }
  let!(:venue) { FactoryGirl.create(:venue) }
  let!(:user) { FactoryGirl.create(:user, :admin) }
  let!(:staff_member) { FactoryGirl.create(:staff_member, master_venue: venue) }
  let!(:accessory) do
    FactoryGirl.create(:accessory, venue: venue, user_requestable: true)
  end
  let!(:accessory_request) do
    FactoryGirl.create(
      :accessory_request,
      :completed,
      accessory: accessory,
      staff_member: staff_member,
      created_by_user: user,
      price_cents: accessory.price_cents,
      accessory_type: accessory.accessory_type,
    )
  end
  let!(:accessory_refund_request) do
    FactoryGirl.create(
      :accessory_refund_request,
      :accepted,
      accessory_request: accessory_request,
      staff_member: staff_member,
      created_by_user: user,
      price_cents: accessory_request.price_cents,
    )
  end

  let(:service) do
    AccessoryRefundRequestAdminApiService.new(
      requster_user: user,
      accessory_refund_request: accessory_refund_request,
    )
  end

  context "when call complete" do
    context "before call" do
      specify "no accessory restocks for given accessory_refund_request" do
        expect(accessory_refund_request.accessory_request.accessory.accessory_restocks.count).to eq(0)
      end
      specify "accessory_refund_request status should be accepted" do
        expect(accessory_refund_request.accepted?).to eq(true)
      end
    end

    context "after call" do
      context "when reusable is true" do
        let!(:result) { service.complete(reusable: true) }

        it "should succeed" do
          expect(result).to be_success
        end

        it "accessory restocks should be created" do
          expect(result.accessory_refund_request.accessory_request.accessory.accessory_restocks.count).to eq(1)
        end
      end

      context "when reusable is false" do
        let!(:result) { service.complete(reusable: false) }

        it "should succeed" do
          expect(result).to be_success
        end

        it "accessory restocks should not be created" do
          expect(result.accessory_refund_request.accessory_request.accessory.accessory_restocks.count).to eq(0)
        end
      end
    end
  end
end
