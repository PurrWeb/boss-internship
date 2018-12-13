require "rails_helper"

RSpec.describe "Staff member cancel accessory requests API endpoint", :accessories do
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
  let(:accessory) {
    FactoryGirl.create(
      :accessory,
      venue: venue,
      user_requestable: true,
      accessory_type: Accessory.accessory_types[:uniform],
      size: "S,M,L,XL,XXL",
    )
  }
  let(:now) { Time.current }
  let(:access_token) do
    WebApiAccessToken.new(
      expires_at: 30.minutes.from_now,
      user: user,
    ).persist!
  end
  let(:accessory_request) do
    FactoryGirl.create(:accessory_request,
                       staff_member: staff_member,
                       accessory_type: accessory.accessory_type,
                       price_cents: accessory.price_cents,
                       size: accessory.size,
                       accessory: accessory)
  end

  let(:cancel_response) do
    post(url_helpers.cancel_request_api_v1_staff_member_staff_member_accessory_request_path(staff_member, accessory_request))
  end

  context "before call" do
    it "accessories request should exist" do
      expect(staff_member.accessory_requests.count).to eq(1)
    end
  end

  context "cancel accessory request" do
    before do
      cancel_response
    end

    it "status should be canceled" do
      expect(accessory_request.current_state).to eq("canceled")
    end

    it 'it should return created accessory' do
      json = JSON.parse(cancel_response.body)
      accessory_request_json = json.fetch("accessoryRequest")
      filtered_accessory_request_json = accessory_request_json.
        except("createdAt", "updatedAt", "timeline")
      expect(filtered_accessory_request_json).to eq({
        "id" => accessory_request.id,
        "hasRefundRequest" => accessory_request.has_refund_request?,
        "accessoryName" => accessory_request.accessory.name,
        "size" => accessory_request.size,
        "status" => accessory_request.current_state,
        "payslipDate" => nil,
        "refundFrozen" => nil,
        "refundPayslipDate" => nil,
        "refundRequestStatus" => nil,
        "requestFrozen" => false,
        "venueName" => accessory_request.accessory.venue.name
      })

      time_line_json = accessory_request_json.fetch("timeline")
      expect(time_line_json.count).to eq(2)
      expect(time_line_json.first.fetch("state")).to eq("pending")
      expect(time_line_json.last.fetch("state")).to eq("canceled")
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
