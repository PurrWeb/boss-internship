require 'rails_helper'

RSpec.describe 'Id Scanner scan spec' do
  include Rack::Test::Methods
  include HeaderHelpers
  include ActiveSupport::Testing::TimeHelpers

  let(:now) { Time.current }
  let(:rota_shift_date) { RotaShiftDate.new(now) }
  let(:start_of_day) { rota_shift_date.start_time }
  let(:user) { FactoryGirl.create(:user) }
  let(:url) { url_helpers.api_id_scanner_app_v1_scan_path }
  let(:scan_time) { start_of_day + 10.hours }
  let(:response) do
    travel_to scan_time do
      post(url, params)
    end
  end
  let(:params) do
    {}
  end

  before do
    set_authorization_header(api_key.key)
  end

  context "api key doesn't exist" do
    let(:api_key) do
      key = double('api key')
      allow(key).to receive(:key).and_return('foo')
      key
    end

    specify 'should not succeed' do
      expect(response.status).to eq(unauthorised_status)
    end

    specify 'return empty response' do
      json_response = JSON.parse(response.body)
      expect(json_response).to eq(
        "errors" =>  Api::IdScannerApp::V1::IdScannerAppController.not_authenticated_error_json
      )
    end
  end

  context "api key is disabled" do
    let(:api_key) do
      IdScannerAppApiKey.create!(
        name: 'My Key',
        creator: user,
        disabled_by_user: user,
        disabled_at: now,
      )
    end

    specify 'api key should be disabled' do
      expect(api_key.enabled?).to eq(false)
    end

    specify 'should not succeed' do
      expect(response.status).to eq(unauthorised_status)
    end

    specify 'return empty response' do
      json_response = JSON.parse(response.body)
      expect(json_response).to eq(
        "errors" =>  Api::IdScannerApp::V1::IdScannerAppController.not_authenticated_error_json
      )
    end
  end

  context 'guid is valid' do
    let(:staff_member) do
      FactoryGirl.create(:staff_member)
    end
    let(:params) do
      {
        guid: staff_member.id_scanner_guid
      }
    end
    let(:api_key) do
      IdScannerAppApiKey.create!(
        name: 'My Key',
        creator: user
      )
    end

    before do
      set_authorization_header(api_key.key)
    end

    specify 'should succeed' do
      expect(response.status).to eq(ok_status)
    end

    specify 'return staff member data' do
      json_response = JSON.parse(response.body)
      expect(json_response).to eq({
        "staffMember" => {
          "name" => staff_member.full_name,
          "masterVenueName" => staff_member.master_venue.name,
          "avatarUrl" => staff_member.avatar_url,
        }
      })
    end

    context 'when staff member is security staff' do
      let(:staff_member) do
        FactoryGirl.create(:staff_member, :security)
      end

      specify 'master venue name should be listed as N/A' do
        json_response = JSON.parse(response.body)
        expect(
          json_response.fetch("staffMember").fetch("masterVenueName")
        ).to eq('N/A')
      end
    end
  end

  context 'guid is for disabled staff member' do
    let(:staff_member) do
      FactoryGirl.create(:staff_member, :disabled)
    end
    let(:params) do
      {
        guid: staff_member.id_scanner_guid
      }
    end
    let(:api_key) do
      IdScannerAppApiKey.create!(
        name: 'My Key',
        creator: user
      )
    end

    before do
      set_authorization_header(api_key.key)
    end

    specify 'should succeed' do
      expect(response.status).to eq(unauthorised_status)
    end

    specify 'return empty response' do
      json_response = JSON.parse(response.body)
      expect(json_response).to eq({})
    end
  end

  context 'guid does not exist' do
    let(:params) do
      {
        guid: '123ea-23-23223-2233'
      }
    end
    let(:api_key) do
      IdScannerAppApiKey.create!(
        name: 'My Key',
        creator: user
      )
    end

    before do
      set_authorization_header(api_key.key)
    end

    specify 'should succeed' do
      expect(response.status).to eq(unauthorised_status)
    end

    specify 'return empty response' do
      json_response = JSON.parse(response.body)
      expect(json_response).to eq({})
    end
  end

  context 'scan is rescan' do
    let(:staff_member) do
      FactoryGirl.create(:staff_member)
    end
    let(:params) do
      {
        guid: staff_member.id_scanner_guid
      }
    end
    let(:api_key) do
      IdScannerAppApiKey.create!(
        name: 'My Key',
        creator: user
      )
    end
    let(:original_scan_time) do
      scan_time - 2.hours
    end
    let(:existing_scan_attempt) do
      travel_to original_scan_time do
        IdScannerScanAttempt.create!(
          api_key: api_key,
          guid: staff_member.id_scanner_guid,
          status: IdScannerScanAttempt::SUCCESS_STATUS,
          linked_staff_member: staff_member
        )
      end
    end

    before do
      set_authorization_header(api_key.key)
      existing_scan_attempt
    end

    specify 'should give bad request status' do
      expect(response.status).to eq(bad_request_status)
    end

    specify 'return empty response' do
      json_response = JSON.parse(response.body)
      expect(json_response).to eq({
        "staffMember" => {
          "name" => staff_member.full_name,
          "masterVenueName" => staff_member.master_venue.name,
          "avatarUrl" => staff_member.avatar_url,
        }
      })
    end
  end

  # This case was introduced because of a bug where one staff member's
  # scan was counted as another
  context 'second staff member scans' do
    let(:staff_member) do
      FactoryGirl.create(:staff_member)
    end
    let(:other_staff_member) do
      FactoryGirl.create(:staff_member)
    end
    let(:params) do
      {
        guid: other_staff_member.id_scanner_guid
      }
    end
    let(:api_key) do
      IdScannerAppApiKey.create!(
        name: 'My Key',
        creator: user
      )
    end
    let(:original_scan_time) do
      scan_time - 2.hours
    end
    let(:existing_scan_attempt) do
      travel_to original_scan_time do
        IdScannerScanAttempt.create!(
          api_key: api_key,
          guid: staff_member.id_scanner_guid,
          status: IdScannerScanAttempt::SUCCESS_STATUS,
          linked_staff_member: staff_member
        )
      end
    end

    before do
      set_authorization_header(api_key.key)
      existing_scan_attempt
    end

    specify 'should succeed' do
      expect(response.status).to eq(ok_status)
    end

    specify 'return staff member data' do
      json_response = JSON.parse(response.body)
      expect(json_response).to eq({
        "staffMember" => {
          "name" => other_staff_member.full_name,
          "masterVenueName" => other_staff_member.master_venue.name,
          "avatarUrl" => other_staff_member.avatar_url,
        }
      })
    end
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

  def bad_request_status
    403
  end
end
