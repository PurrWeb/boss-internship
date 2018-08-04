require 'rails_helper'

RSpec.describe 'Staff member refund accessory requests API endpoint' do
  include Rack::Test::Methods
  include HeaderHelpers
  include ActiveSupport::Testing::TimeHelpers

  before do
    set_authorization_header(access_token.token)
    accessory_request
  end

  let(:venue) { FactoryGirl.create(:venue) }
  let(:user) { FactoryGirl.create(:user, :admin) }
  let(:staff_member) { FactoryGirl.create(:staff_member, master_venue: venue) }
  let(:accessory) { FactoryGirl.create(
    :accessory,
    venue: venue,
    user_requestable: true,
    accessory_type: Accessory.accessory_types[:uniform],
    size: 'S,M,L,XL,XXL'
  ) }
  let(:now) { Time.current }
  let(:access_token) do
    WebApiAccessToken.new(
      expires_at: 30.minutes.from_now,
      user: user
    ).persist!
  end
  let(:accessory_request) {
    accessory_request = AccessoryRequestApiService.new(
      requester: user,
      staff_member: staff_member,
      accessory_request: AccessoryRequest.new
    ).create(params: {size: 'L', accessoryId: accessory.id}).accessory_request

    accepted_accessory_request = AccessoryRequestAdminApiService.new(
      requster_user: user,
      accessory_request: accessory_request
    ).accept.accessory_request

    completed_accessory_request = AccessoryRequestAdminApiService.new(
      requster_user: user,
      accessory_request: accepted_accessory_request
    ).complete.accessory_request
  }

  let(:admin_reject_refund) {
    refund_accessory_request = AccessoryRequestApiService.new(
      requester: user,
      staff_member: staff_member,
      accessory_request: accessory_request
    ).refund.accessory_request

    AccessoryRefundRequestAdminApiService.new(
      requster_user: user,
      accessory_refund_request: refund_accessory_request
    ).reject
  }

  let(:refund_response) do
    post(url_helpers.refund_request_api_v1_staff_member_staff_member_accessory_request_path(staff_member, accessory_request))
  end

  context 'before call' do
    it 'accessories request should exist, and completed' do
      expect(staff_member.accessory_requests.count).to eq(1)
      expect(staff_member.accessory_requests.first.current_state == "completed").to eq(true)
    end
  end

  context 'refund accessory request' do
    before do
      refund_response
    end

    it ' accessory request status should be completed, refund request should be pending' do
      expect(accessory_request.current_state).to eq("completed")
      expect(accessory_request.accessory_refund_request.current_state).to eq("pending")
    end

    it ' should return refunded accessory request' do
      json = JSON.parse(refund_response.body).except("createdAt", "updatedAt", "timeline")
      expect(json).to eq({
        "id" => accessory_request.id,
        "frozen" => accessory_request.frozen?,
        "hasRefundRequest" => accessory_request.has_refund_request?,
        "accessoryName" => accessory_request.accessory.name,
        "size" => accessory_request.size,
        "status" => accessory_request.current_state,
        "refundRequestStatus" => accessory_request.accessory_refund_request.current_state,
      })
    end
  end

  context 'resend refund accessory request' do
    before do
      admin_reject_refund
    end

    it ' should have rejected status' do
      expect(accessory_request.accessory_refund_request.current_state).to eq("rejected")
    end

    context ' refund request' do
      before do
        refund_response
      end

      it ' accessory request status should be completed, refund request should be pending' do
        expect(accessory_request.current_state).to eq("completed")
        expect(accessory_request.accessory_refund_request.current_state).to eq("pending")
      end

      it ' should return refunded accessory request' do
        json = JSON.parse(refund_response.body).except("createdAt", "updatedAt", "timeline")
        expect(json).to eq({
          "id" => accessory_request.id,
          "frozen" => accessory_request.frozen?,
          "hasRefundRequest" => accessory_request.has_refund_request?,
          "accessoryName" => accessory_request.accessory.name,
          "size" => accessory_request.size,
          "status" => accessory_request.current_state,
          "refundRequestStatus" => accessory_request.accessory_refund_request.current_state,
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
