require "rails_helper"

RSpec.describe "Accessory request timeline", :accessories do
  include Rack::Test::Methods
  include HeaderHelpers
  include ActiveSupport::Testing::TimeHelpers

  before do
    expected_timeline
  end

  def timeline_item(requester:, created_at:, state:, request_type:)
    {
      requester: {
        id: requester.id, fullName: requester.full_name,
      },
      createdAt: created_at,
      state: state,
      requestType: request_type,
    }
  end

  let(:venue) { FactoryGirl.create(:venue) }
  let(:accessory_request) { create_accessory_request }
  let(:accessory_refund_request) { create_accessory_refund_request }
  let(:user) { FactoryGirl.create(:user, venues: [venue]) }
  let(:staff_member) { FactoryGirl.create(:staff_member, master_venue: venue) }
  let(:accessory) {
    FactoryGirl.create(
      :accessory,
      venue: venue,
      user_requestable: true,
      accessory_type: Accessory.accessory_types[:uniform],
      size: "S,M,L,XL,XXL",
    )
  }

  def create_accessory_request
    AccessoryRequestApiService.new(
      requester: user,
      staff_member: staff_member,
      accessory_request: AccessoryRequest.new,
    ).create(params: {size: "L", accessoryId: accessory.id}).accessory_request
  end

  def create_accessory_refund_request
    AccessoryRequestApiService.new(
      requester: user,
      staff_member: staff_member,
      accessory_request: accessory_request,
    ).refund.accessory_request
  end

  def request_create_timeline_item
    timeline_item(
      requester: accessory_request.created_by_user,
      created_at: accessory_request.created_at,
      state: AccessoryRequest.initial_state,
      request_type: "accessoryRequest",
    )
  end

  def request_accept_timeline_item
    AccessoryRequestAdminApiService.new(
      requster_user: user,
      accessory_request: accessory_request,
    ).accept

    timeline_item(
      requester: user,
      created_at: accessory_request.state_machine.last_transition.created_at,
      state: accessory_request.state_machine.last_transition.to_state,
      request_type: "accessoryRequest",
    )
  end

  def request_complete_timeline_item
    AccessoryRequestAdminApiService.new(
      requster_user: user,
      accessory_request: accessory_request,
    ).complete
    timeline_item(
      requester: user,
      created_at: accessory_request.state_machine.last_transition.created_at,
      state: accessory_request.state_machine.last_transition.to_state,
      request_type: "accessoryRequest",
    )
  end

  def refund_create_timeline_item
    timeline_item(
      requester: accessory_refund_request.created_by_user,
      created_at: accessory_refund_request.created_at,
      state: AccessoryRefundRequest.initial_state,
      request_type: "refundRequest",
    )
  end

  def refund_accept_timeline_item
    AccessoryRefundRequestAdminApiService.new(
      requster_user: user,
      accessory_refund_request: accessory_refund_request,
    ).accept
    timeline_item(
      requester: user,
      created_at: accessory_refund_request.state_machine.last_transition.created_at,
      state: accessory_refund_request.state_machine.last_transition.to_state,
      request_type: "refundRequest",
    )
  end

  def refund_complete_timeline_item
    AccessoryRefundRequestAdminApiService.new(
      requster_user: user,
      accessory_refund_request: accessory_refund_request,
    ).complete
    timeline_item(
      requester: user,
      created_at: accessory_refund_request.state_machine.last_transition.created_at,
      state: accessory_refund_request.state_machine.last_transition.to_state,
      request_type: "refundRequest",
    )
  end

  let(:expected_timeline) do
    [
      request_create_timeline_item,
      request_accept_timeline_item,
      request_complete_timeline_item,
      refund_create_timeline_item,
      refund_accept_timeline_item,
      refund_complete_timeline_item,
    ]
  end

  let(:timeline_from_service) do
    AccessoryRequestTimeline.new(accessory_request: accessory_request).serialize
  end

  context "accept accessory refund request" do
    it " accessory refund request status should be accepted" do
      expect(timeline_from_service).to eq(expected_timeline)
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
