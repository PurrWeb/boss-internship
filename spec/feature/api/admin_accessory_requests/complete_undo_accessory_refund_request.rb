require 'rails_helper'

RSpec.describe 'Admin complete & undo accessory requests API endpoint' do
  include Rack::Test::Methods
  include HeaderHelpers
  include ActiveSupport::Testing::TimeHelpers

  before do
    set_authorization_header(access_token.token)
    accessory_refund_request
  end

  let(:venue) { FactoryGirl.create(:venue) }
  let(:user) { FactoryGirl.create(:user, venues: [venue]) }
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
  }
  let(:valid_params) do
    {
      accessoryId: accessory.id,
      venueId: venue.id,
    }
  end
  let(:accessory_refund_request) {
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
    refund_accessory_request = AccessoryRequestApiService.new(
      requester: user,
      staff_member: staff_member,
      accessory_request: accessory_request
    ).refund.accessory_request
  }
  let(:accept_refund_request) do
    AccessoryRequestAdminApiService.new(
      requster_user: user,
      accessory_request: accessory_refund_request
    ).accept
  end
  let(:undo_response) do
    post(url_helpers.undo_refund_api_v1_accessory_request_path(accessory_refund_request), params)
  end
  let(:complete_response) do
    post(url_helpers.complete_refund_api_v1_accessory_request_path(accessory_refund_request), params)
  end

  context 'before call' do
    it 'accessory and accessory request should exist, and request should completed' do
      expect(venue.accessories.count).to eq(1)
      expect(staff_member.accessory_requests.first.current_state).to eq("completed")
      expect(staff_member.accessory_requests.first.accessory_refund_request.current_state).to eq("pending")
    end
  end

  context 'accept accessory refund request' do
    before do
      accept_refund_request
    end

    it ' accessory refund request status should be accepted' do
      expect(accessory_refund_request.current_state).to eq("accepted")
    end

    context 'undo accepted refund request' do
      let(:params) do
        valid_params
      end

      before do
        undo_response
      end

      it ' accessory refund request status should be pending' do
        expect(accessory_refund_request.current_state).to eq("pending")
      end

      it ' should return pending accessory refund request' do
        json = JSON.parse(undo_response.body).except("createdAt", "updatedAt", "timeline")
        expect(json).to eq({
          "id" => accessory_refund_request.id,
          "size" => accessory_refund_request.accessory_request.size,
          "staffMemberId" => staff_member.id,
          "accessoryId" => accessory.id,
          "status" => accessory_refund_request.current_state,
          "frozen" => accessory_refund_request.frozen?,
        })
      end
    end

    context 'complete accepted request' do
      let(:params) do
        valid_params
      end

      before do
        complete_response
      end

      it ' accessory refund request status should be completed' do
        expect(accessory_refund_request.current_state).to eq("completed")
      end

      it ' should return completed accessory refund request' do
        json = JSON.parse(complete_response.body).except("createdAt", "updatedAt", "timeline")
        expect(json).to eq({
          "id" => accessory_refund_request.id,
          "size" => accessory_refund_request.accessory_request.size,
          "staffMemberId" => staff_member.id,
          "accessoryId" => accessory.id,
          "status" => accessory_refund_request.current_state,
          "frozen" => accessory_refund_request.frozen?,
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