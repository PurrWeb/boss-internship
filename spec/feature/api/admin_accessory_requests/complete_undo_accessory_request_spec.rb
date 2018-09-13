require "rails_helper"

RSpec.describe "Admin complete & undo accessory requests API endpoint", :accessories do
  include Rack::Test::Methods
  include HeaderHelpers
  include ActiveSupport::Testing::TimeHelpers

  before do
    set_authorization_header(access_token.token)
    accessory_request
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
  let(:now) { Time.current }
  let(:access_token) do
    WebApiAccessToken.new(
      expires_at: 30.minutes.from_now,
      user: user,
    ).persist!
  end
  let(:accessory_request) {
    accessory_request = AccessoryRequestApiService.new(
      requester: user,
      staff_member: staff_member,
      accessory_request: AccessoryRequest.new,
    ).create(params: {size: "L", accessoryId: accessory.id}).accessory_request
  }
  let(:valid_params) do
    {
      accessoryId: accessory.id,
      venueId: venue.id,
    }
  end
  let(:accept_request) do
    accepted_accessory_request = AccessoryRequestAdminApiService.new(
      requster_user: user,
      accessory_request: accessory_request,
    ).accept
  end
  let(:undo_response) do
    post(url_helpers.undo_api_v1_accessory_request_path(accessory_request), params)
  end
  let(:complete_response) do
    post(url_helpers.complete_api_v1_accessory_request_path(accessory_request), params)
  end

  context "before call" do
    it "accessory and accessory request should exist, and request should pending" do
      expect(venue.accessories.count).to eq(1)
      expect(staff_member.accessory_requests.first.current_state == "pending").to eq(true)
    end
  end

  context "accept accessory request" do
    before do
      accept_request
    end

    it "accessory request status should be accepted" do
      expect(accessory_request.current_state).to eq("accepted")
    end

    context "undo accepted request" do
      let(:params) do
        valid_params
      end

      before do
        undo_response
      end

      it "accessory request status should be pending" do
        expect(accessory_request.current_state).to eq("pending")
      end

      it "should return pending accessory request" do
        json = JSON.parse(undo_response.body).except("createdAt", "updatedAt", "timeline")
        expect(json).to eq({
          "id" => accessory_request.id,
          "size" => accessory_request.size,
          "staffMemberId" => staff_member.id,
          "accessoryId" => accessory.id,
          "status" => accessory_request.current_state,
          "frozen" => accessory_request.frozen?,
        })
      end
    end

    context "complete accepted request" do
      let(:params) do
        valid_params
      end

      context "no finance report exists" do
        context "before call" do
          specify "no finance reports exist" do
            expect(FinanceReport.count).to eq(0)
          end
        end

        context "after call" do
          before do
            complete_response
          end

          it "should succeed" do
            expect(complete_response.status).to eq(ok_status)
          end

          it "should create finanance report and  assocaiate it with request" do
            accessory_request.reload
            expect(FinanceReport.count).to eq(1)
            finance_report = FinanceReport.last
            expect(finance_report.staff_member).to eq(staff_member)
            expect(finance_report.venue).to eq(staff_member.master_venue)
            expect(finance_report.week_start).to eq(current_week.start_date)
            expect(accessory_request.finance_report).to eq(finance_report)
          end

          it "accessory request status should be completed" do
            accessory_request.reload
            expect(accessory_request.current_state).to eq("completed")
          end

          it "should return accessory request and accessory" do
            json = JSON.parse(complete_response.body)
            expect(json).to have_key("accessoryRequest")
            expect(json).to have_key("accessory")
          end

          it "should return completed accessory request" do
            accessory_request.reload
            json = JSON.parse(complete_response.body)
            accessory_request_json = json["accessoryRequest"]
            expect(accessory_request_json).to eq({
              "id" => accessory_request.id,
              "size" => accessory_request.size,
              "staffMemberId" => staff_member.id,
              "accessoryId" => accessory.id,
              "status" => accessory_request.current_state,
              "frozen" => accessory_request.frozen?,
            })
          end
        end
      end

      context "ready finance report already exists" do
        let(:existing_finance_report) do
          FactoryGirl.create(
            :finance_report,
            staff_member: staff_member,
            venue: venue,
            week_start: current_week.start_date,
          ).tap do |report|
            report.mark_ready!
          end
        end
        let(:params) do
          valid_params
        end

        before do
          existing_finance_report
        end

        context "before call" do
          specify "finance report should exist" do
            expect(FinanceReport.count).to eq(1)
            accessory_request.reload
            expect(accessory_request.finance_report).to_not eq(existing_finance_report)
          end
        end

        context "after call" do
          before do
            complete_response
          end

          it "should succeed" do
            expect(complete_response.status).to eq(ok_status)
          end

          it "should update finanance report and  assocaiate it with refund" do
            accessory_request.reload
            expect(FinanceReport.count).to eq(1)
            expect(accessory_request.finance_report).to eq(existing_finance_report)
          end
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
