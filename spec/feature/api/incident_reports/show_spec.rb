require 'rails_helper'

RSpec.describe 'Show incident report API endpoint' do
  include Rack::Test::Methods
  include HeaderHelpers
  include ActiveSupport::Testing::TimeHelpers

  let(:staff_member) do
    FactoryGirl.create(
      :staff_member,
    )
  end
  let(:user) { FactoryGirl.create(:user, venues: [venue]) }
  let(:venue) { FactoryGirl.create(:venue) }
  let(:access_token) do
    WebApiAccessToken.new(
      expires_at: 30.minutes.from_now,
      user: user
    ).persist!
  end
  let(:api_key) do
    ApiKey.create!(
      venue: venue,
      user: user,
      key_type: ApiKey::BOSS_KEY_TYPE
    )
  end
  let(:existing_incident_report) do
    FactoryGirl.create(
      :incident_report,
      venue: venue,
      time: incident_time.iso8601,
      location: location,
      description: description,
      involved_witness_details: involved_witness_details,
      recorded_by_name: recorded_by_name,
      camera_name: camera_name,
      report_text: report_text,
      uninvolved_witness_details: uninvolved_witness_details,
      police_officer_details: police_officer_details
    )
  end
  let(:url) { url_helpers.api_v1_incident_report_path(existing_incident_report) }
  let(:response) { get(url, params) }
  let(:params) { {} }
  let(:now) { Time.current.round }
  let(:venue_id) { venue.id }
  let(:incident_time) { now - 1.month }
  let(:location) { "Some where" }
  let(:description) { "Some description" }
  let(:involved_witness_details) { "Some involved witness details" }
  let(:recorded_by_name) { "Some recorded by name" }
  let(:camera_name) { "Some camera name" }
  let(:report_text) { "Some report text" }
  let(:uninvolved_witness_details) { "Some uninvovled witness details" }
  let(:police_officer_details) { 'Some police details' }
  # Syntatic sugar for tests that
  # don't directly check the reponse
  let(:perform_call) { response }

  before do
    existing_incident_report
    set_authorization_header(access_token.token)
  end

  context 'before call' do
    specify '1 report should exist' do
      expect(IncidentReport.count).to eq(1)
    end
  end

  context 'when report is enabled' do
    specify 'it should succeed' do
      expect(response.status).to eq(ok_status)
    end

    specify 'it should return report data' do
      json_response = JSON.parse(response.body)
      existing_incident_report.reload

      expect(
        json_response
      ).to eq({
        "id" => existing_incident_report.id,
        "venueId" => venue_id,
        "cameraName" => camera_name,
        "description" => description,
        "createdAt" => existing_incident_report.created_at.iso8601,
        "creator" => JSON.parse(Api::V1::UserSerializer.new(existing_incident_report.user).to_json),
        "disabledAt" => nil,
        "disabledByUserId" => nil,
        "incidentTime" => incident_time.iso8601,
        "involvedWitnessDetails" => involved_witness_details,
        "location" => location,
        "policeOfficerDetails" => police_officer_details,
        "recordedByName" => recorded_by_name,
        "uninvolvedWitnessDetails" => uninvolved_witness_details,
        "report" => report_text
      })
    end
  end

  context 'when report is disabled' do
    before do
      IncidentReportDisableApiService.new(
        requester: user,
        incident_report: existing_incident_report
      ).call!
    end

    specify 'it should succeed' do
      expect(response.status).to eq(ok_status)
    end

    specify 'it should return report data' do
      json_response = nil
      call_time = now.round
      travel_to call_time do
        json_response = JSON.parse(response.body)
      end
      existing_incident_report.reload

      expect(
        json_response
      ).to eq({
        "id" => existing_incident_report.id,
        "venueId" => venue_id,
        "cameraName" => camera_name,
        "description" => description,
        "disabledAt" => call_time.iso8601,
        "createdAt" => existing_incident_report.created_at.iso8601,
        "creator" => JSON.parse(Api::V1::UserSerializer.new(existing_incident_report.user).to_json),
        "disabledByUserId" => user.id,
        "incidentTime" => incident_time.iso8601,
        "involvedWitnessDetails" => involved_witness_details,
        "location" => location,
        "policeOfficerDetails" => police_officer_details,
        "recordedByName" => recorded_by_name,
        "uninvolvedWitnessDetails" => uninvolved_witness_details,
        "report" => report_text
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

  def unprocessible_entity_status
    422
  end

  def unauthorised_status
    401
  end
end
