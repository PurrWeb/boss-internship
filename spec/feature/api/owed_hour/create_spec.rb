require 'rails_helper'

RSpec.describe 'Create owed hour API endpoint' do
  include Rack::Test::Methods
  include HeaderHelpers
  include ActiveSupport::Testing::TimeHelpers

  before do
    set_authorization_header(access_token.token)
  end

  let(:staff_member) do
    FactoryGirl.create(
      :staff_member,
    )
  end
  let(:venue) { staff_member.master_venue }
  let(:user) { FactoryGirl.create(:user, venues: [venue]) }
  let(:date) { (now - 1.week).to_date }
  let(:payslip_week) do
    RotaWeek.new(date + 1.week)
  end
  let(:starts_at_offset) do
    0
  end
  let(:ends_at_offset) do
    145
  end
  let(:now) { Time.current }
  let(:access_token) do
    WebApiAccessToken.new(
      expires_at: 30.minutes.from_now,
      user: user
    ).persist!
  end
  let(:url) do
    url_helpers.api_v1_staff_member_owed_hours_path(staff_member)
  end
  let(:response) do
    post(url, params)
  end
  let(:valid_params) do
    {
      date: UIRotaDate.format(date),
      startsAt: starts_at_offset,
      endsAt: ends_at_offset,
      note: "TEST"
    }
  end
  let(:empty_params) do
    {
      date: nil,
      startsAt: nil,
      endsAt: nil,
      note: nil
    }
  end

  context 'when empty params supplied' do
    let(:params) do
      empty_params
    end

    before do
      response
    end

    it 'should return validation errors' do
      json = JSON.parse(response.body)

      expect(json["errors"]["date"]).to eq(["can't be blank"])
      expect(json["errors"]["payslipDate"]).to eq(["can't be blank"])
      expect(json["errors"]["startsAt"]).to eq(["can't be blank"])
      expect(json["errors"]["endsAt"]).to eq(["can't be blank"])
    end
  end

  context 'when valid params supplied' do
    let(:params) do
      valid_params
    end
    
    before do
      response
    end

    it 'should return ok status' do
      expect(response.status).to eq(ok_status)
    end

    it 'should return all owed hour data grouped by week' do
      response_json = JSON.parse(response.body)
      expect(response_json.class).to eq(Array)
      expect(response_json.count).to eq(1)
      week_json = response_json.first

      expect(week_json.keys).to eq(["week", "owedHours"])
    end

    it 'should create the owed hour' do
      json = JSON.parse(response.body)


      owed_hours_json = json.first.fetch("owedHours")
      expect(owed_hours_json.count).to eq(1)

      owed_hour_json = owed_hours_json.first
      expect(owed_hour_json.fetch("id")).to eq(staff_member.owed_hours.last.id)
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
