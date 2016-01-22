require 'rails_helper'

RSpec.describe 'Api access' do
  include Rack::Test::Methods
  include ActiveSupport::Testing::TimeHelpers

  let(:rota_shift) { FactoryGirl.create(:rota_shift) }
  let(:user) { FactoryGirl.create(:user) }

  before do
    login_as user
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
    let(:rota_date) { Time.now }
    let(:venue) { FactoryGirl.create(:venue) }
    let(:url) do
      url_helpers.api_v1_venue_rota_rota_shifts_path(
        rota_id: rota_date,
        venue_id: venue.id
      )
    end

    context 'supplying valid parameters' do
      let(:staff_member) { FactoryGirl.create(:staff_member) }
      let(:starts_at) { (rota_date.beginning_of_day + 5.hours).utc }
      let(:ends_at) { (rota_date.beginning_of_day + 7.hours).utc }
      let(:params) do
        {
          staff_member_id: staff_member.id.to_s,
          starts_at: starts_at.iso8601,
          ends_at: ends_at.iso8601
        }
      end

      before do
        response
      end

      it 'should succeed' do
        expect(response.status).to eq(ok_status)
      end

      it 'should return a staff member record' do
        json = JSON.parse(response.body)

        expect(
          json
        ).to include(
          "id",
          "starts_at" => starts_at.iso8601,
          "ends_at" => ends_at.iso8601
        )

        expect(
          json["staff_member"]
        ).to include(
          "id" => staff_member.id
        )
      end

      it 'should create a RotaShift record' do
        expect(RotaShift.count).to eq(1)
      end
    end

    context 'supplying invalid parameters' do
      let(:rota) { FactoryGirl.create(:rota) }
      let(:staff_member) { FactoryGirl.create(:staff_member) }
      let(:starts_at) { (Time.now.beginning_of_day + 5.hours).utc }
      let(:invalid_ends_at) { nil }
      let(:params) do
        {
          rota_id: rota.id.to_s,
          staff_member_id: staff_member.id.to_s,
          starts_at: starts_at.iso8601,
          ends_at: invalid_ends_at
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
      rota_shift
    end

    specify 'it should succeed' do
      expect(response.status).to eq(ok_status)
    end

    specify 'shift is disabled' do
      response
      rota_shift.reload
      expect(rota_shift).to be_disabled
    end
  end

  describe "update" do
    let(:url) { url_helpers.api_v1_rota_shift_path(rota_shift) }
    let(:original_starts_at) { (Time.now.beginning_of_day + 5.hours).round.utc }
    let(:original_ends_at) { (Time.now.beginning_of_day + 7.hours).round.utc }
    let(:new_starts_at) { original_starts_at + 1.hour }
    let(:new_ends_at) { original_ends_at + 1.hour }
    let(:rota_shift) do
      FactoryGirl.create(
        :rota_shift,
        starts_at: original_starts_at,
        ends_at: original_ends_at
      )
    end
    let(:params) do
      {
        starts_at: new_starts_at.iso8601,
        ends_at: new_ends_at.iso8601,
        staff_member_id: rota_shift.staff_member.id
      }
    end
    let(:response) { put(url, params) }

    before do
      rota_shift
    end

    specify 'it should succeed' do
      expect(response.status).to eq(ok_status)
    end

    specify 'times should be updated' do
      response
      rota_shift.reload
      expect(rota_shift.starts_at.utc).to eq(new_starts_at)
      expect(rota_shift.ends_at.utc).to eq(new_ends_at)
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
