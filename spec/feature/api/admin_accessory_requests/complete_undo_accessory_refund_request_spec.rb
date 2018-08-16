require 'rails_helper'

RSpec.describe 'Admin complete & undo accessory requests API endpoint' do
  include Rack::Test::Methods
  include HeaderHelpers
  include ActiveSupport::Testing::TimeHelpers

  let(:now) { Time.current }
  let(:today) { RotaShiftDate.to_rota_date(now) }
  let(:current_week) { RotaWeek.new(today) }
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
  let(:existing_finance_report) do
    FactoryGirl.create(
      :finance_report,
      staff_member: staff_member,
      venue: venue,
      week_start: current_week.start_date
    ).tap do |report|
      report.mark_ready!
    end
  end
  let(:undo_response) do
    post(url_helpers.undo_refund_api_v1_accessory_request_path(accessory_refund_request), params)
  end
  let(:complete_response) do
    post(url_helpers.complete_refund_api_v1_accessory_request_path(accessory_refund_request), params)
  end

  before do
    set_authorization_header(access_token.token)
    existing_finance_report
    accessory_refund_request
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
        existing_finance_report.mark_ready!
      end

      context 'before call' do
        specify 'finance report should exist' do
          expect(FinanceReport.count).to eq(1)
          accessory_refund_request.reload
          expect(existing_finance_report.current_state).to eq(FinanceReportStateMachine::READY_STATE.to_s)
          expect(accessory_refund_request.finance_report).to eq(nil)
        end
      end

      context 'after call' do
        it 'should succeed' do
          complete_response
          expect(complete_response.status).to eq(ok_status)
        end

        it 'should update finanance report and  assocaiate it with refund' do
          complete_response
          accessory_refund_request.reload
          expect(FinanceReport.count).to eq(1)
          expect(accessory_refund_request.finance_report).to eq(existing_finance_report)
        end

        it ' accessory refund request status should be completed' do
          complete_response
          expect(accessory_refund_request.current_state).to eq("completed")
        end

        it ' should return completed accessory refund request' do
          complete_response
          accessory_refund_request.reload
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
