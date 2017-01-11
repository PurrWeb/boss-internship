require 'rails_helper'

RSpec.describe 'Pool Loft Sync Endpoint' do
  include Rack::Test::Methods
  include HeaderHelpers

  let(:params) do
    {
      "table_sessions" => table_sessions_json,
      "table_session_duration_edits" => table_session_duration_edits_json
    }
  end
  let(:url) { url_helpers.sync_api_v1_pool_hall_index_path }
  let(:response) { post(url, params) }
  let(:user) { FactoryGirl.create(:user) }
  let(:api_key) do
    ApiKey.create!(
      user: user,
      key_type: ApiKey::POOL_HALL_KEY_TYPE
    )
  end

  before do
    set_authorization_header(api_key.key)
  end

  context 'before call' do
    specify 'no PoolLoftTableSession records exist' do
      expect(PoolLoftTableSession.count).to eq(0)
    end

    specify 'no PoolLoftTableSessionEdit records exist' do
      expect(PoolLoftTableSessionEdit.count).to eq(0)
    end
  end

  context 'no data is supplied' do
    let(:table_sessions_json) { [].to_json }
    let(:table_session_duration_edits_json) { [].to_json }

    specify 'should succeed' do
      expect(response.status).to eq(ok_status)
    end

    specify 'should return empty response' do
      json_response = JSON.parse(response.body)
      expect(json_response).to eq({})
    end

    specify 'no PoolLoftTableSession records are created' do
      response
      expect(PoolLoftTableSession.count).to eq(0)
    end

    specify 'no PoolLoftTableSessionEdit records are created' do
      response
      expect(PoolLoftTableSessionEdit.count).to eq(0)
    end

    context 'api key is disabled' do
      let(:api_key) do
        key = ApiKey.create!(
          user: user,
          key_type: ApiKey::POOL_HALL_KEY_TYPE
        )
        key.state_machine.transition_to!(:deleted, requster_user_id: user)
        key
      end

      specify 'should return access denied error' do
        expect(response.status).to eq(access_denied_status)
      end
    end

    context 'table session data is supplied' do
      let(:now) { Time.current }
      let(:remote_table_session_id) { 3 }
      let(:remote_table_session_guid) { SecureRandom.uuid }
      let(:remote_table_session_duration_seconds) { 34 }
      let(:remote_table_session_edited_by_admin) { true }
      let(:remote_table_session_starts_at) { now }
      let(:remote_table_id) { 75 }
      let(:remote_table_name) { 'Top Table' }
      let(:remote_table_guid) { SecureRandom.uuid }
      let(:remote_table_type) { 'pool' }
      let(:remote_table_session_updated_at) { now - 1.day }
      let(:remote_table_session_created_at) { now - 2.days}
      let(:remote_table_session) do
        PoolLoftTableSession.new(
          id: remote_table_session_id,
          guid: remote_table_session_guid,
          duration_seconds: remote_table_session_duration_seconds,
          edited_by_admin: remote_table_session_edited_by_admin,
          starts_at: remote_table_session_starts_at,
          table_id: remote_table_id,
          table_name: remote_table_name,
          table_guid: remote_table_guid,
          table_type: remote_table_type,
          updated_at: remote_table_session_updated_at,
          created_at: remote_table_session_created_at
        )
      end
      let(:table_sessions_json) do
        {
          "id" => remote_table_session.id,
          "guid" => remote_table_session.guid,
          "duration_seconds" => remote_table_session.duration_seconds,
          "edited_by_admin" => remote_table_session.edited_by_admin,
          "starts_at" => remote_table_session.starts_at.utc.iso8601,
          "table_id" => remote_table_session.table_id,
          "table_name" => remote_table_session.table_name,
          "table_guid" => remote_table_session.table_guid,
          "table_type" => remote_table_session.table_type,
          "updated_at" => remote_table_session.updated_at.utc.iso8601,
          "created_at" => remote_table_session.created_at.utc.iso8601
        }.to_json
      end
      let(:table_session_duration_edits_json) { [].to_json }

      specify 'should succeed' do
        expect(response.status).to eq(ok_status)
      end

      specify 'should return empty response' do
        json_response = JSON.parse(response.body)
        expect(json_response).to eq({})
      end

      specify 'no PoolLoftTableSession records are created' do
        response
        expect(PoolLoftTableSession.count).to eq(1)
      end

      specify 'no PoolLoftTableSessionEdit records are created' do
        response
        expect(PoolLoftTableSessionEdit.count).to eq(0)
      end

      context 'remote table session already exists on server' do
        let(:local_table_session_duration_seconds) { 2 }
        let(:local_table_session_edited_by_admin) { true }
        let(:local_table_session_starts_at) { remote_table_session_starts_at. - 1.day }
        let(:local_table_session_updated_at) { remote_table_session_updated_at - 1.day}
        let(:local_table_session) do
          PoolLoftTableSession.create!(
            id: remote_table_session_id,
            guid: remote_table_session_guid,
            duration_seconds: local_table_session_duration_seconds,
            edited_by_admin: local_table_session_edited_by_admin,
            starts_at: local_table_session_starts_at,
            table_id: remote_table_id,
            table_name: remote_table_name,
            table_guid: remote_table_guid,
            table_type: remote_table_type,
            updated_at: local_table_session_updated_at,
            created_at: remote_table_session_created_at
          )
        end

        before do
          local_table_session
        end

        context 'before call' do
          specify '1 PoolLoftTableSession record exist' do
            expect(PoolLoftTableSession.count).to eq(1)
          end

          specify 'no PoolLoftTableSessionEdit records exist' do
            expect(PoolLoftTableSessionEdit.count).to eq(0)
          end
        end

        it 'should succeed' do
          expect(response.status).to eq(ok_status)
        end

        it 'should return empty response' do
          json_response = JSON.parse(response.body)
          expect(json_response).to eq({})
        end

        it 'should have updated the existing session' do
          response
          expect(
            local_table_session.reload.duration_seconds
          ).to eq(remote_table_session_duration_seconds)
        end

        specify 'no new PoolLoftTableSession records are created' do
          response
          expect(PoolLoftTableSession.count).to eq(1)
        end

        specify 'no PoolLoftTableSessionEdit records are created' do
          response
          expect(PoolLoftTableSessionEdit.count).to eq(0)
        end
      end
    end

    context 'table session duration data is supplied' do
      let(:now) { Time.current }
      let(:remote_table_session_duration_id) { 3 }
      let(:remote_table_session_duration_guid) { SecureRandom.uuid }
      let(:remote_admin_token_id) { 63 }
      let(:remote_admin_token_guid) { SecureRandom.uuid }
      let(:remote_table_session_id) { 34 }
      let(:remote_table_session_guid) { SecureRandom.uuid }
      let(:remote_table_session_edit_old_duration_seconds) { 399 }
      let(:remote_table_session_edit_new_duration_seconds) { 233 }
      let(:remote_table_session_edit_updated_at) { now - 1.hour }
      let(:remote_table_session_edit_created_at) { now - 2.hours }
      let(:remote_table_session_duration) do
        PoolLoftTableSessionEdit.new(
          id: remote_table_session_duration_id,
          guid: remote_table_session_duration_guid,
          admin_token_id: remote_admin_token_id,
          admin_token_guid: remote_admin_token_guid,
          table_session_id: remote_table_session_id,
          table_session_guid: remote_table_session_guid,
          old_duration_seconds: remote_table_session_edit_old_duration_seconds,
          new_duration_seconds:  remote_table_session_edit_new_duration_seconds,
          updated_at: remote_table_session_edit_updated_at.utc.iso8601,
          created_at: remote_table_session_edit_created_at.utc.iso8601
        )
      end
      let(:table_sessions_json) { [].to_json }
      let(:table_session_duration_edits_json) do
        {
          "id" => remote_table_session_duration.id,
          "guid" => remote_table_session_duration.guid,
          "admin_token_id" => remote_table_session_duration.admin_token_id,
          "admin_token_guid" => remote_table_session_duration.admin_token_guid,
          "table_session_id" => remote_table_session_duration.table_session_id,
          "table_session_guid" => remote_table_session_duration.table_session_guid,
          "old_duration_seconds" => remote_table_session_duration.old_duration_seconds,
          "new_duration_seconds" => remote_table_session_duration.new_duration_seconds,
          "updated_at" => remote_table_session_duration.updated_at.utc.iso8601,
          "created_at" => remote_table_session_duration.created_at.utc.iso8601
        }.to_json
      end

      specify 'should succeed' do
        expect(response.status).to eq(ok_status)
      end

      specify 'should return empty response' do
        json_response = JSON.parse(response.body)
        expect(json_response).to eq({})
      end

      specify 'no PoolLoftTableSession records are created' do
        response
        expect(PoolLoftTableSession.count).to eq(0)
      end

      specify 'no PoolLoftTableSessionEdit records are created' do
        response
        expect(PoolLoftTableSessionEdit.count).to eq(1)
      end

      context 'remote table session edit already exists on server' do
        let(:local_table_session_edit_old_duration_seconds) { 934 }
        let(:local_table_session_edit_new_duration_seconds) { 23 }
        let(:local_table_session_edit) do
          PoolLoftTableSessionEdit.create!(
            id: remote_table_session_duration_id,
            guid: remote_table_session_duration_guid,
            admin_token_id: remote_admin_token_id,
            admin_token_guid: remote_admin_token_guid,
            table_session_id: remote_table_session_id,
            table_session_guid: remote_table_session_guid,
            old_duration_seconds: local_table_session_edit_old_duration_seconds,
            new_duration_seconds:  local_table_session_edit_new_duration_seconds,
            updated_at: remote_table_session_edit_updated_at.utc.iso8601,
            created_at: remote_table_session_edit_created_at.utc.iso8601
          )
        end

        before do
          local_table_session_edit
        end

        context 'before call' do
          specify 'no PoolLoftTableSession records exist' do
            expect(PoolLoftTableSession.count).to eq(0)
          end

          specify '1 PoolLoftTableSessionEdit record exists' do
            expect(PoolLoftTableSessionEdit.count).to eq(1)
          end
        end

        it 'should succeed' do
          expect(response.status).to eq(ok_status)
        end

        it 'should return empty response' do
          json_response = JSON.parse(response.body)
          expect(json_response).to eq({})
        end

        it 'should have updated the existing session edit' do
          response
          expect(
            local_table_session_edit.reload.new_duration_seconds
          ).to eq(remote_table_session_edit_new_duration_seconds)
        end

        specify 'no new PoolLoftTableSession records are created' do
          response
          expect(PoolLoftTableSession.count).to eq(0)
        end

        specify 'no new PoolLoftTableSessionEdit records are created' do
          response
          expect(PoolLoftTableSessionEdit.count).to eq(1)
        end
      end
    end
  end

  def payload_table_sessions_key
    "table_sessions"
  end

  def payload_table_session_duration_edits_key
    "table_session_duration_edits"
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

  def access_denied_status
    401
  end

  def unprocessable_entity_status
    422
  end
end
