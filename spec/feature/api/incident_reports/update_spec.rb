require 'rails_helper'

RSpec.describe 'Update incident report API endpoint' do
  include Rack::Test::Methods
  include HeaderHelpers
  include ActiveSupport::Testing::TimeHelpers

  let(:staff_member) do
    FactoryGirl.create(
      :staff_member,
    )
  end
  let(:user) { FactoryGirl.create(:user, venues: [venue, new_venue]) }
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
      time: old_incident_time.iso8601,
      location: old_location,
      description: old_description,
      involved_witness_details: old_involved_witness_details,
      recorded_by_name: old_recorded_by_name,
      camera_name: old_camera_name,
      report_text: old_report_text,
      uninvolved_witness_details: old_uninvolved_witness_details,
      police_officer_details: old_police_officer_details
    )
  end
  let(:url) { url_helpers.api_v1_incident_report_path(existing_incident_report) }
  let(:response) { patch(url, params) }
  let(:valid_params) do
    {
      venueId: new_venue_id,
      incidentTime: new_incident_time.iso8601,
      location: new_location,
      description: new_description,
      involvedWitnessDetails: new_involved_witness_details,
      recordedByName: new_recorded_by_name,
      cameraName: new_camera_name,
      report: new_report_text,
      uninvolvedWitnessDetails: new_uninvolved_witness_details,
      policeOfficerDetails: new_police_officer_details
    }
  end
  let(:now) { Time.current.round }
  let(:new_venue) { FactoryGirl.create(:venue) }
  let(:new_venue_id) { new_venue.id }
  let(:new_incident_time) { now - 2.months }
  let(:new_location) { "New where" }
  let(:new_description) { "New description" }
  let(:new_involved_witness_details) { "New involved witness details" }
  let(:new_recorded_by_name) { "New recorded by name" }
  let(:new_camera_name) { "New camera name" }
  let(:new_report_text) { "New report text" }
  let(:new_uninvolved_witness_details) { "New uninvovled witness details" }
  let(:new_police_officer_details) { 'New police details' }
  let(:old_venue_id) { venue.id }
  let(:old_incident_time) { now - 1.month }
  let(:old_location) { "Some where" }
  let(:old_description) { "Some description" }
  let(:old_involved_witness_details) { "Some involved witness details" }
  let(:old_recorded_by_name) { "Some recorded by name" }
  let(:old_camera_name) { "Some camera name" }
  let(:old_report_text) { "Some report text" }
  let(:old_uninvolved_witness_details) { "Some uninvovled witness details" }
  let(:old_police_officer_details) { 'Some police details' }
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

  context 'when using valid params' do
    let(:params) { valid_params }

    specify 'it should succeed' do
      expect(response.status).to eq(ok_status)
    end

    specify 'it should update the report' do
      perform_call
      expect(IncidentReport.count).to eq(1)
      existing_incident_report.reload

      expect(existing_incident_report.venue_id).to eq(new_venue_id)
      expect(existing_incident_report.time).to eq(new_incident_time)
      expect(existing_incident_report.location).to eq(new_location)
      expect(existing_incident_report.description).to eq(new_description)
      expect(existing_incident_report.involved_witness_details).to eq(new_involved_witness_details)
      expect(existing_incident_report.recorded_by_name).to eq(new_recorded_by_name)
      expect(existing_incident_report.camera_name).to eq(new_camera_name)
      expect(existing_incident_report.report_text).to eq(new_report_text)
    end

    specify 'it should return updated report data' do
      json_response = JSON.parse(response.body)
      existing_incident_report.reload

      expect(
        json_response
      ).to eq({
        "id" => existing_incident_report.id,
        "venueId" => new_venue_id,
        "cameraName" => new_camera_name,
        "description" => new_description,
        "disabledAt" => nil,
        "createdAt" => existing_incident_report.created_at.iso8601,
        "creator" => JSON.parse(Api::V1::UserSerializer.new(existing_incident_report.user).to_json),
        "disabledByUserId" => nil,
        "incidentTime" => new_incident_time.iso8601,
        "involvedWitnessDetails" => new_involved_witness_details,
        "location" => new_location,
        "policeOfficerDetails" => new_police_officer_details,
        "recordedByName" => new_recorded_by_name,
        "uninvolvedWitnessDetails" => new_uninvolved_witness_details,
        "report" => new_report_text
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

    specify 'it should not update the entity' do
      perform_call
      existing_incident_report.reload

      expect(existing_incident_report.venue_id).to eq(old_venue_id)
      expect(existing_incident_report.time).to eq(old_incident_time)
      expect(existing_incident_report.location).to eq(old_location)
      expect(existing_incident_report.description).to eq(old_description)
      expect(existing_incident_report.involved_witness_details).to eq(old_involved_witness_details)
      expect(existing_incident_report.recorded_by_name).to eq(old_recorded_by_name)
      expect(existing_incident_report.camera_name).to eq(old_camera_name)
      expect(existing_incident_report.report_text).to eq(old_report_text)
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
