require "rails_helper"

RSpec.describe "Admin accept and reject accessory requests API endpoint", :accessories do
  include Rack::Test::Methods
  include HeaderHelpers
  include ActiveSupport::Testing::TimeHelpers

  before do
    set_authorization_header(access_token.token)
    accessory_refund_request
  end

  let(:now) { Time.current }
  let(:today) { RotaShiftDate.to_rota_date(now) }
  let(:current_week) { RotaWeek.new(today) }
  let(:venue) { FactoryGirl.create(:venue) }
  let(:user) { FactoryGirl.create(:user, :admin) }
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
  let(:accessory_request) do
    FactoryGirl.create(:accessory_request,
                       :completed,
                       staff_member: staff_member,
                       accessory_type: accessory.accessory_type,
                       price_cents: accessory.price_cents,
                       size: accessory.size,
                       accessory: accessory)
  end
  let(:accessory_refund_request) do
    FactoryGirl.create(:accessory_refund_request,
                       staff_member: staff_member,
                       price_cents: accessory_request.price_cents,
                       accessory_request: accessory_request)
  end
  let(:access_token) do
    WebApiAccessToken.new(
      expires_at: now + 30.minutes,
      user: user,
    ).persist!
  end
  let(:valid_params) do
    {
      accessoryId: accessory.id,
      venueId: venue.id,
    }
  end
  let(:accept_response) do
    post(url_helpers.accept_refund_api_v1_accessory_request_path(accessory_refund_request), params)
  end
  let(:reject_response) do
    post(url_helpers.reject_refund_api_v1_accessory_request_path(accessory_refund_request), params)
  end

  context "before call" do
    it "accessory and accessory request should exist, and request should completed" do
      expect(venue.accessories.count).to eq(1)
      expect(staff_member.accessory_requests.first.current_state).to eq("completed")
      expect(staff_member.accessory_requests.first.accessory_refund_request.current_state).to eq("pending")
    end
  end

  context "accept accessory refund request" do
    let(:params) do
      valid_params
    end

    before do
      accept_response
    end

    it "should succeed" do
      expect(accept_response.status).to eq(ok_status)
    end

    it "accessory request status should be completed" do
      expect(accessory_refund_request.accessory_request.current_state).to eq("completed")
      expect(accessory_refund_request.current_state).to eq("accepted")
    end

    it " should return accepted accessory request" do
      json = JSON.parse(accept_response.body).except("createdAt", "updatedAt", "timeline")
      expect(json).to eq({
        "id" => accessory_refund_request.id,
        "size" => accessory_refund_request.accessory_request.size,
        "staffMemberId" => staff_member.id,
        "accessoryId" => accessory.id,
        "reusable" => accessory_refund_request.reusable,
        "status" => accessory_refund_request.current_state,
        "frozen" => accessory_refund_request.frozen?,
      })
    end
  end

  context "reject accessory request" do
    let(:params) do
      valid_params
    end

    before do
      reject_response
    end

    it "accessory request status should be accepted" do
      expect(accessory_refund_request.accessory_request.current_state).to eq("completed")
      expect(accessory_refund_request.current_state).to eq("rejected")
    end

    it "should return accessory refund request and accessory" do
      json = JSON.parse(reject_response.body)
      expect(json).to have_key("accessoryRefundRequest")
      expect(json).to have_key("accessory")
    end

    it "should return accepted accessory refund request" do
      json = JSON.parse(reject_response.body)
      refund_request_json = json["accessoryRefundRequest"]
      expect(refund_request_json).to eq({
        "id" => accessory_refund_request.id,
        "size" => accessory_refund_request.accessory_request.size,
        "staffMemberId" => staff_member.id,
        "accessoryId" => accessory.id,
        "status" => accessory_refund_request.current_state,
        "frozen" => accessory_refund_request.frozen?,
        "reusable" => accessory_refund_request.reusable,
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
