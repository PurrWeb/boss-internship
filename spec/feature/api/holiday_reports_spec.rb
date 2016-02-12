require 'rails_helper'

RSpec.describe 'Holiday api end points' do
  include Rack::Test::Methods

  let(:user) { FactoryGirl.create(:user, :admin) }

  before do
    login_as user
  end

  describe '#show' do
    let(:url) { url_helpers.api_v1_holiday_report_path(start_date.strftime(Rota.url_date_format)) }
    let(:start_date) { Time.now.to_date.monday }
    let(:end_date) { Time.now.to_date.monday + 2.days }
    let!(:holiday) do
      FactoryGirl.create(
        :holiday,
        start_date: start_date,
        end_date: end_date
      )
    end
    let(:response) { get(url) }

    context do
      specify 'should succeed' do
        expect(response.status).to eq(ok_status)
      end

      specify 'should return a json representation of all holidays in that week' do
        json = JSON.parse(response.body)
        expect(json.keys).to eq(["holidays", "staff_members"])

        expect(json["holidays"].count).to eq(1)
        expect(json["holidays"].first).to include(json_holiday(holiday))

        expect(json["staff_members"].count).to eq(1)
        expect(json["staff_members"].first).to include(json_staff_member(holiday.staff_member))
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
      "staff_member" => {
        "id" => holiday.staff_member.id,
        "url" => url_helpers.api_v1_staff_member_url(holiday.staff_member)
      }
    }
  end

  def json_staff_member(staff_member)
    {
      "id"=> staff_member.id,
      "url"=> url_helpers.api_v1_staff_member_url(staff_member),
      "staff_type"=> {
        "id"=> staff_member.staff_type.id,
        "url"=> url_helpers.api_v1_staff_type_url(staff_member.staff_type)
      },
      "first_name" => staff_member.name.first_name,
      "surname" => staff_member.name.surname,
      "preferred_hours"=> staff_member.hours_preference_note,
      "preferred_days"=> staff_member.day_perference_note,
      "venue" => {
        "id" => staff_member.venue.id,
        "url" => url_helpers.api_v1_venue_url(staff_member.venue)
      },
      "holidays"=> staff_member.holidays.map do |holiday|
        {
          "id" => holiday.id,
          "url" => url_helpers.api_v1_holiday_url(holiday)
        }
      end
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
