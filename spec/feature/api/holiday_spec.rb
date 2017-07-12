require 'rails_helper'

RSpec.describe 'Holiday api end points' do
  include Rack::Test::Methods
  include HeaderHelpers

  let(:user) { FactoryGirl.create(:user, :admin) }
  let(:access_token) do
    WebApiAccessToken.new(
      expires_at: 30.minutes.from_now,
      user: user
    ).persist!
  end

  before do
    set_authorization_header(access_token.token)
  end

  describe '#show' do
    let(:url) { url_helpers.api_v1_holiday_path(holiday) }
    let(:holiday) do
      FactoryGirl.create(:holiday)
    end

    describe 'response' do
      let(:response) { get(url) }

      specify 'should succeed' do
        expect(response.status).to eq(ok_status)
      end

      specify 'should return a json representation of the holiday' do
        json = JSON.parse(response.body)
        expect(json).to eq(json_holiday(holiday))
      end
    end
  end

  private
  def json_holiday(holiday)
    {
      "id" => holiday.id,
      "url" => url_helpers.api_v1_holiday_url(holiday),
      "start_date" => holiday.start_date.iso8601,
      "end_date" => holiday.end_date.iso8601,
      "holiday_type" => holiday.holiday_type,
      "status" => holiday.current_state,
      "days" => holiday.days,
      "staff_member" => {
        "id" => holiday.staff_member.id,
        "url" => url_helpers.api_v1_staff_member_url(holiday.staff_member)
      }
    }
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

  def unprocessable_entity_status
    422
  end
end
