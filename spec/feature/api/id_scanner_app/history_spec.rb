require 'rails_helper'

RSpec.describe 'Id Scanner history spec' do
  include Rack::Test::Methods
  include HeaderHelpers

  let(:user) { FactoryGirl.create(:user) }
  let(:venue_name) { 'Master venue name' }
  let(:venue) { FactoryGirl.create(:venue, name: venue_name) }
  let(:staff_member) { FactoryGirl.create(:staff_member, master_venue: venue) }
  let(:api_key) do
    IdScannerAppApiKey.create!(
      name: 'My Key',
      creator: user
    )
  end
  let(:other_api_key) do
    IdScannerAppApiKey.create!(
      name: 'Historical Key',
      creator: user
    )
  end
  let(:url) { url_helpers.api_id_scanner_app_v1_history_index_path }
  let(:response) { get(url, params) }
  let(:params) { {} }
  let(:existing_scan_attempts) do
    [successful_scan_attempt]
  end
  let(:successful_scan_attempt) do
    IdScannerScanAttempt.create!(
      api_key: other_api_key,
      status: 'success',
      linked_staff_member: staff_member,
    )
  end

  before do
    existing_scan_attempts
    set_authorization_header(api_key.key)
  end

  specify 'should succed' do
    expect(response.status).to eq(ok_status)
  end

  specify 'return history records' do
    json_response = JSON.parse(response.body)
    expect(json_response.keys).to eq(["items"])

    json_items = json_response.fetch("items")
    expect(json_items).to eq([{
      "apiKeyName" => other_api_key.name,
      "at" => successful_scan_attempt.created_at.iso8601,
      "status" => successful_scan_attempt.status,
      "guid" => successful_scan_attempt.guid,
      "staffMemberName" => staff_member.full_name,
      "staffMemberMasterVenueName" => staff_member.master_venue.name,
      "staffMemberAvatarUrl" => staff_member.avatar_url,
    }])
  end

  def app
    Rails.application
  end

  def url_helpers
    Rails.application.routes.url_helpers
  end

  def ok_status
    200
  end

  def unauthorised_status
    401
  end
end
