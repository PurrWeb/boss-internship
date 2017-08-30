require 'rails_helper'

RSpec.describe 'Create incident report API endpoint' do
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
  before do
    set_authorization_header(access_token.token)
  end
  let(:url) do
    url_helpers.api_v1_incident_reports_path
  end
  let(:response) do
    post(url, params)
  end
  let(:valid_params) do
    {
      venueId: venue_id,
      incidentTime: incident_time.iso8601,
      location: location,
      description: description,
      involvedWitnessDetails: involved_witness_details,
      recordedByName: recorded_by_name,
      cameraName: camera_name,
      reportText: report_text,
      uninvolvedWitnessDetails: uninvolved_witness_details,
      policeOfficerDetails: police_officer_details
    }
  end
  let(:now) { Time.current.round }
  let(:venue_id) { venue.id }
  let(:incident_time) { now }
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

  context 'before call' do
    specify 'no reports should exist' do
      expect(IncidentReport.count).to eq(0)
    end
  end

  context 'when using valid params' do
    let(:params) { valid_params }

    specify 'it should succeed' do
      expect(response.status).to eq(ok_status)
    end

    specify 'it should create the report' do
      perform_call
      expect(IncidentReport.count).to eq(1)
      incident_report = IncidentReport.first
      expect(incident_report.venue_id).to eq(venue_id)
      expect(incident_report.time).to eq(incident_time)
      expect(incident_report.location).to eq(location)
      expect(incident_report.description).to eq(description)
      expect(incident_report.involved_witness_details).to eq(involved_witness_details)
      expect(incident_report.recorded_by_name).to eq(recorded_by_name)
      expect(incident_report.camera_name).to eq(camera_name)
      expect(incident_report.report_text).to eq(report_text)
    end

    specify 'it should create the report' do
      json_response = JSON.parse(response.body)
      created_report = IncidentReport.find(IncidentReport.first.id)

      expect(
        json_response
      ).to eq({
        "id" => created_report.id,
        "venueId" => venue_id,
        "cameraName" => camera_name,
        "description" => description,
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

  context 'validation errors' do
    let(:params) do
      valid_params.merge(uninvolvedWitnessDetails: '')
    end

    specify 'it should not succeed' do
      expect(response.status).to eq(unprocessible_entity_status)
    end

    specify 'it should not create entity' do
      perform_call
      expect(IncidentReport.count).to eq(0)
    end

    specify 'it should return errors' do
      response_json = JSON.parse(response.body)
      expect(
        response_json
      ).to eq({
        "errors" => {
          "uninvolvedWitnessDetails" => ["can't be blank"]
        }
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
