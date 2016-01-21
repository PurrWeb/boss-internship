require 'rails_helper'

RSpec.describe 'Api access' do
  include Rack::Test::Methods
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
    let(:url) { url_helpers.api_v1_rota_shifts_path }

    context 'supplying valid parameters' do
      let(:rota) { FactoryGirl.create(:rota) }
      let(:staff_member) { FactoryGirl.create(:staff_member) }
      let(:starts_at) { (Time.now.beginning_of_day + 5.hours).utc }
      let(:ends_at) { (Time.now.beginning_of_day + 7.hours).utc }
      let(:params) do
        {
          rota_id: rota.id.to_s,
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

        expect(
          json["rota"]
        ).to include(
          "id" => rota.id
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
