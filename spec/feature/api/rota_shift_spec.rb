require 'rails_helper'

RSpec.describe 'Api access' do
  include Rack::Test::Methods
  include ActiveSupport::Testing::TimeHelpers
  include HeaderHelpers

  let(:rota_shift) { FactoryGirl.create(:rota_shift) }
  let(:venue) { rota_shift.rota.venue }
  let(:user) { FactoryGirl.create(:user, :admin) }
  let(:access_token) do
    WebApiAccessToken.new(
      expires_at: 30.minutes.from_now,
      user: user
    ).persist!
  end
  # used for specs that don't test the response directly
  let(:perform_call) do
    response
    nil
  end
  let(:mock_frontend_update_service) { double('mock frontend updates') }

  before do
    allow(FrontendUpdates).to(
      receive(:new).
      with(no_args).
      and_return(mock_frontend_update_service)
    )

    set_authorization_header(access_token.token)
  end

  describe '#show' do
    let(:url) { url_helpers.api_v1_rota_shift_path(rota_shift) }

    describe 'response' do
      let(:response) { get(url) }

      specify 'should succeed' do
        expect(response.status).to eq(ok_status)
      end

      specify 'should return a json representation of the staff member' do
        json = JSON.parse(response.body)
        expect(json).to eq({
          "id" => rota_shift.id,
          "url" => url_helpers.api_v1_rota_shift_url(rota_shift),
          "rota" => {
            "id" => rota_shift.rota.id,
            "url" => url_helpers.api_v1_rota_url(rota_shift.rota)
          },
          "shift_type" => "normal",
          "starts_at" => rota_shift.starts_at.utc.iso8601,
          "ends_at" => rota_shift.ends_at.utc.iso8601,
          "staff_member" => {
            "id" => rota_shift.staff_member.id,
            "url" => url_helpers.api_v1_staff_member_url(rota_shift.staff_member)
          }
        })
      end
    end
  end

  describe "create" do
    let(:response) { post(url, params) }
    let(:rota_date) { Time.zone.now }
    let(:venue) { FactoryGirl.create(:venue) }
    let(:url) do
      url_helpers.api_v1_venue_rota_rota_shifts_path(
        rota_id: rota_date,
        venue_id: venue.id
      )
    end

    context 'supplying valid parameters' do
      let(:staff_member) { FactoryGirl.create(:staff_member) }
      let(:starts_at) { (rota_date.beginning_of_day + 10.hours).utc }
      let(:ends_at) { (rota_date.beginning_of_day + 12.hours).utc }
      let(:params) do
        {
          staff_member_id: staff_member.id.to_s,
          starts_at: starts_at.iso8601,
          ends_at: ends_at.iso8601,
          shift_type: 'normal'
        }
      end

      before do
        allow(mock_frontend_update_service).to receive(:dispatch)
        allow(mock_frontend_update_service).to receive(:create_shift)
      end

      it 'should succeed' do
        expect(response.status).to eq(ok_status)
      end

      specify 'it should update the frontend' do
        expect(mock_frontend_update_service).to(
          receive(:create_shift).with(
            shift: an_instance_of(RotaShift)
          )
        )
        expect(mock_frontend_update_service).to receive(:dispatch).with(no_args)

        perform_call
      end

      it 'should return rota and rotaShift objects' do
        json = JSON.parse(response.body)
        expect(json.keys).to eq(["rotaShift", "rota"])

        rota_shift_json = json.fetch("rotaShift")
        expect(rota_shift_json.keys).to eq([
          "id",
          "rota",
          "shift_type",
          "starts_at",
          "ends_at",
          "staff_member",
        ])
        new_shift = RotaShift.last
        expect(rota_shift_json.fetch("id")).to eq(new_shift.id)
        expect(rota_shift_json.fetch("rota")).to eq(new_shift.rota.id)
        expect(rota_shift_json.fetch("shift_type")).to eq(new_shift.shift_type)
        expect(rota_shift_json.fetch("starts_at")).to eq(new_shift.starts_at.utc.iso8601)
        expect(rota_shift_json.fetch("ends_at")).to eq(new_shift.ends_at.utc.iso8601)
        expect(rota_shift_json.fetch("staff_member")).to eq(new_shift.staff_member.id)

        new_shift_rota = new_shift.rota
        rota_json = json.fetch("rota")
        expect(rota_json.keys).to eq([
          "id",
          "venue",
          "date",
          "status",
        ])
        expect(rota_json.fetch("id")).to eq(new_shift_rota.id)
        expect(rota_json.fetch("venue")).to eq(new_shift_rota.venue.id)
        expect(rota_json.fetch("date")).to eq(UIRotaDate.format(new_shift_rota.date))
        expect(rota_json.fetch("status")).to eq(new_shift_rota.status)
      end

      it 'should create a RotaShift record' do
        perform_call
        expect(RotaShift.count).to eq(1)
      end
    end

    context 'supplying invalid parameters' do
      let(:rota) { FactoryGirl.create(:rota) }
      let(:staff_member) { FactoryGirl.create(:staff_member) }
      let(:starts_at) { (Time.zone.now.beginning_of_day + 8.hours).utc }
      let(:invalid_ends_at) { nil }
      let(:params) do
        {
          rota_id: rota.id.to_s,
          staff_member_id: staff_member.id.to_s,
          starts_at: starts_at.iso8601,
          ends_at: invalid_ends_at,
          shift_type: 'normal'
        }
      end

      before do
        response
      end

      it 'should return unprocessable status' do
        expect(response.status).to eq(unprocessable_entity_status)
      end

      it 'should return errors records' do
        expect(JSON.parse(response.body)).to eq({
          "errors" => {
            "ends_at" => ["can't be blank"]
          }
        })
      end

      it 'should create a RotaShift record' do
        expect(RotaShift.count).to eq(0)
      end
    end
  end

  describe "delete" do
    let(:url) { url_helpers.api_v1_rota_shift_path(rota_shift) }
    let(:response) { delete(url) }
    let(:rota_shift) { FactoryGirl.create(:rota_shift) }

    before do
      allow(mock_frontend_update_service).to(
        receive(:dispatch).with(no_args)
      )
      allow(mock_frontend_update_service).to receive(:delete_shift)
      rota_shift
    end

    specify 'it should succeed' do
      expect(response.status).to eq(ok_status)
    end

    specify 'it should update the frontend' do
      expect(mock_frontend_update_service).to(
        receive(:delete_shift).with(
          shift: rota_shift
        )
      )
      expect(mock_frontend_update_service).to receive(:dispatch)

      perform_call
    end

    specify 'shift is disabled' do
      perform_call
      rota_shift.reload
      expect(rota_shift).to be_disabled
    end
  end

  describe "update" do
    let(:url) { url_helpers.api_v1_rota_shift_path(rota_shift) }
    let(:original_starts_at) { (Time.zone.now.beginning_of_day + 9.hours).round.utc }
    let(:original_ends_at) { (Time.zone.now.beginning_of_day + 10.hours).round.utc }
    let(:new_starts_at) { original_starts_at + 1.hour }
    let(:new_ends_at) { original_ends_at + 1.hour }
    let(:rota_shift) do
      FactoryGirl.create(
        :rota_shift,
        starts_at: original_starts_at,
        ends_at: original_ends_at
      )
    end
    let(:response) { put(url, params) }

    before do
      rota_shift
    end

    context 'when params are valid' do
      let(:params) do
        {
          starts_at: new_starts_at.iso8601,
          ends_at: new_ends_at.iso8601,
          staff_member_id: rota_shift.staff_member.id
        }
      end

      before do
        allow(mock_frontend_update_service).to receive(:dispatch)
        allow(mock_frontend_update_service).to receive(:update_shift)
      end

      specify 'it should succeed' do
        expect(response.status).to eq(ok_status)
      end

      specify 'it should update the frontend' do
        expect(mock_frontend_update_service).to(
          receive(:update_shift).with(
            shift: rota_shift
          )
        )
        expect(mock_frontend_update_service).to receive(:dispatch)

        perform_call
      end

      specify 'times should be updated' do
        response
        rota_shift.reload
        expect(rota_shift.starts_at.utc).to eq(new_starts_at)
        expect(rota_shift.ends_at.utc).to eq(new_ends_at)
      end
    end

    context 'when parameters are invalid' do
      let(:params) do
        {
          starts_at: new_starts_at.iso8601,
          ends_at: nil,
          staff_member_id: rota_shift.staff_member.id
        }
      end

      it 'should return unprocessable status' do
        expect(response.status).to eq(unprocessable_entity_status)
      end

      it 'should return errors records' do
        expect(JSON.parse(response.body)).to eq({
          "errors" => {
            "ends_at" => ["can't be blank"]
          }
        })
      end

      it 'should not update the RotaShift record' do
        call_time = 2.hours.ago.round
        travel_to(call_time) do
          response
        end
        rota_shift.reload
        expect(rota_shift.updated_at).to_not eq(call_time)
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
