require 'rails_helper'

RSpec.describe 'Create holiday API endpoint' do
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
  let(:start_date) do
    (now + 2.week).to_date
  end
  let(:end_date) do
    (now + 2.week + 2.days).to_date
  end
  let(:payslip_date) do
    RotaWeek.new(start_date + 1.week).start_date
  end
  let(:holiday_type) do
    Holiday::HOLIDAY_TYPES[1]
  end
  let(:invalid_start_date) do
    (now - 2.week + 2.days).to_date
  end
  let(:invalid_end_date) do
    (now - 2.week).to_date
  end
  let(:now) { Time.current }
  let(:access_token) do
    WebApiAccessToken.new(
      expires_at: 30.minutes.from_now,
      user: user
    ).persist!
  end
  let(:url) do
    url_helpers.api_v1_staff_member_holidays_path(staff_member)
  end
  let(:response) do
    post(url, params)
  end
  let(:valid_params) do
    {
      start_date: UIRotaDate.format(start_date),
      end_date: UIRotaDate.format(end_date),
      payslip_date: UIRotaDate.format(payslip_date),
      holiday_type: holiday_type,
      note: ""
    }
  end

  context 'before call' do
    it 'no holidays for staff member should exist' do
      expect(staff_member.holidays.count).to eq(0)
    end
  end

  context 'creating holiday for staff member' do
    context ' with valid params' do
      let(:params) do
        valid_params
      end

      before do
        response
      end

      it 'should return ok status' do
        expect(response.status).to eq(ok_status)
      end

      it 'it should create holiday' do
        expect(staff_member.holidays.count).to eq(1)
        expect(staff_member.holidays.first.start_date).to eq(start_date)
        expect(staff_member.holidays.first.end_date).to eq(end_date)
        expect(staff_member.holidays.first.holiday_type).to eq(holiday_type)
        expect(staff_member.holidays.first.creator).to eq(user)
      end

      it 'it should return created holiday' do
        json = JSON.parse(response.body)
        holiday_json = json.fetch("holiday")

        expect(holiday_json["id"]).to eq(staff_member.holidays.first.id)
        expect(holiday_json["start_date"]).to eq(UIRotaDate.format(staff_member.holidays.first.start_date))
        expect(holiday_json["end_date"]).to eq(UIRotaDate.format(staff_member.holidays.first.end_date))
        expect(holiday_json["holiday_type"]).to eq(staff_member.holidays.first.holiday_type)
        expect(holiday_json["creator"]).to eq(staff_member.holidays.first.creator.full_name)
      end
    end

    context ' with empty params' do
      let(:params) do
        valid_params.merge({
          start_date: '',
          end_date: '',
          holiday_type: ''
        })
      end

      before do
        response
      end

      it 'should return unprocessable_entity status' do
        expect(response.status).to eq(unprocessable_entity_status)
      end

      it 'it shouldn\'t create staff member' do
        expect(staff_member.holidays.count).to eq(0)
      end

      it 'should return errors json' do
        json = JSON.parse(response.body)
        expect(json).to eq({
          "errors" => {
            "startDate" => ["can't be blank"],
            "endDate" => ["can't be blank"],
            "payslipDate" => ["can't be blank"],
            "holidayType" => ["is required"]
          }
        })
      end
    end

    context ' with invalid params' do
      let(:params) do
        valid_params.merge({
          start_date: UIRotaDate.format(invalid_start_date),
          end_date: UIRotaDate.format(invalid_end_date),
        })
      end

      before do
        response
      end

      it 'should return unprocessable_entity status' do
        expect(response.status).to eq(unprocessable_entity_status)
      end

      it 'it shouldn\'t create holiday' do
        expect(staff_member.holidays.count).to eq(0)
      end

      it 'should return errors json' do
        json = JSON.parse(response.body)
        expect(json).to eq({
          "errors" => {
            "base" => ["Start date cannot be after end date"],
          }
        })
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
