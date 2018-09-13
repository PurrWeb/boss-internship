require "rails_helper"

RSpec.describe "Staff member refund accessory requests API endpoint", :accessories do
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
  let(:accessory_request) do
    FactoryGirl.create(:accessory_request,
                       :completed,
                       staff_member: staff_member,
                       accessory_type: accessory.accessory_type,
                       price_cents: accessory.price_cents,
                       size: accessory.size,
                       accessory: accessory)
  end
  let(:reusable) { true }
  let(:now) { Time.current }
  let(:access_token) do
    WebApiAccessToken.new(
      expires_at: 30.minutes.from_now,
      user: user,
    ).persist!
  end

  let(:refund_url) { url_helpers.refund_request_api_v1_staff_member_staff_member_accessory_request_path(staff_member, accessory_request) }

  let(:response) do
    post(refund_url, {reusable: reusable})
  end

  context "before call" do
    it "accessories request should exist, and completed" do
      expect(staff_member.accessory_requests.count).to eq(1)
      expect(staff_member.accessory_requests.first.current_state == "completed").to eq(true)
    end
  end

  describe "when staff member refund request" do
    before do
      refund_response
    end

    it ' accessory request status should be completed, refund request should be pending' do
      expect(accessory_request.current_state).to eq("completed")
      expect(accessory_request.accessory_refund_request.current_state).to eq("pending")
    end

    it ' should return refunded accessory request' do
      json = JSON.parse(refund_response.body).except("createdAt", "updatedAt", "timeline")
      accessory_request = staff_member.accessory_requests.first
      accessory_request_json = json.fetch("accessoryRequest")
      timeline_json = accessory_request_json.fetch("timeline")
      accessory_request_attributes_json = accessory_request_json.
        except("createdAt", "updatedAt", "timeline")

      expect(accessory_request_attributes_json).to eq({
        "id" => accessory_request.id,
        "hasRefundRequest" => accessory_request.has_refund_request?,
        "accessoryName" => accessory_request.accessory.name,
        "size" => accessory_request.size,
        "status" => accessory_request.current_state,
        "refundRequestStatus" => accessory_request.accessory_refund_request.current_state,
        "payslipDate" => UIRotaDate.format(accessory_request.payslip_date),
        "refundFrozen" => nil,
        "refundPayslipDate" => nil,
        "requestFrozen" => false,
      })
      expect(timeline_json.count).to eq(4)
      expected_states = ["pending", 'accepted', 'completed', 'pending']
      expected_states.each_with_index do |expected_state, index|
        timeline_json_record = timeline_json[index]
        expect(timeline_json_record.fetch("state")).to eq(expected_state)
      end
    end

    it "should return ok response status" do
      expect(response.status).to eq(ok_status)
    end

    it "should return accessory request with pending refund request status" do
      json = JSON.parse(response.body)
      accessory_request_json = json["accessoryRequest"]
      expect(accessory_request_json["hasRefundRequest"]).to eq(true)
      expect(accessory_request_json["refundRequestStatus"]).to eq("pending")
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
        accessory_request = staff_member.accessory_requests.first
        accessory_request_json = json.fetch("accessoryRequest")
        timeline_json = accessory_request_json.fetch("timeline")
        accessory_request_attributes_json = accessory_request_json.
          except("createdAt", "updatedAt", "timeline")

        expect(accessory_request_attributes_json).to eq({
          "id" => accessory_request.id,
          "hasRefundRequest" => accessory_request.has_refund_request?,
          "accessoryName" => accessory_request.accessory.name,
          "size" => accessory_request.size,
          "status" => accessory_request.current_state,
          "refundRequestStatus" => accessory_request.accessory_refund_request.current_state,
          "requestFrozen" => accessory_request.frozen?,
          "payslipDate" => UIRotaDate.format(accessory_request.payslip_date),
          "refundFrozen" => nil,
          "refundPayslipDate" => nil
        })

        expect(timeline_json.count).to eq(6)
        expected_states = ["pending", 'accepted', 'completed', 'pending', 'rejected', 'pending']
        expected_states.each_with_index do |expected_state, index|
          timeline_json_record = timeline_json[index]
          expect(timeline_json_record.fetch("state")).to eq(expected_state)
        end
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
