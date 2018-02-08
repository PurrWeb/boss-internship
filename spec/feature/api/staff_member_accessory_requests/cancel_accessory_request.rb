require 'rails_helper'

RSpec.describe 'Staff member cancel accessory requests API endpoint' do
  include Rack::Test::Methods
  include HeaderHelpers
  include ActiveSupport::Testing::TimeHelpers

  before do
    set_authorization_header(access_token.token)
    accessory_request
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
    AccessoryRequestApiService.new(
      requester: user,
      staff_member: staff_member,
      accessory_request: AccessoryRequest.new
    ).create(params: {size: 'L', accessoryId: accessory.id}).accessory_request
  }

  let(:cancel_response) do
    post(url_helpers.cancel_request_api_v1_staff_member_staff_member_accessory_request_path(staff_member, accessory_request))
  end

  context 'before call' do
    it 'accessories request should exist' do
      expect(staff_member.accessory_requests.count).to eq(1)
    end
  end

  context 'cancel accessory request' do
    before do
      cancel_response
    end

    it ' status should be canceled' do
      expect(accessory_request.current_state).to eq("canceled")
    end

    it 'it should return created accessory' do
      json = JSON.parse(cancel_response.body).except("createdAt", "updatedAt", "timeline")
      expect(json).to eq({
        "id" => accessory_request.id,
        "frozen" => accessory_request.frozen?,
        "hasRefundRequest" => accessory_request.has_refund_request?,
        "accessoryName" => accessory_request.accessory.name,
        "size" => accessory_request.size,
        "status" => accessory_request.current_state,
        "refundRequestStatus" => nil,
      })
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