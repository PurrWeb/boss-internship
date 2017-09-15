require 'rails_helper'

RSpec.describe 'Update holiday API endpoint' do
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
  let(:old_start_date) do
    (now + 1.week).to_date
  end
  let(:old_end_date) do
    (now + 1.week + 2.days).to_date
  end
  let(:old_holiday_type) do
    Holiday::HOLIDAY_TYPES[0]
  end
  let(:new_start_date) do
    (now + 2.week).to_date
  end
  let(:invalid_start_date) do
    (now - 2.week).to_date
  end
  let(:invalid_end_date) do
    (now - 2.week + 2.days).to_date
  end
  let(:new_end_date) do
    (now + 2.week + 2.days).to_date
  end
  let(:new_holiday_type) do
    Holiday::HOLIDAY_TYPES[1]
  end
  let(:now) { Time.current }
  let(:holiday) do
    FactoryGirl.create(
      :holiday,
      staff_member: staff_member,
      start_date: old_start_date,
      end_date: old_end_date,
      holiday_type: old_holiday_type,
    )
  end
  let(:access_token) do
    WebApiAccessToken.new(
      expires_at: 30.minutes.from_now,
      user: user
    ).persist!
  end
  let(:url) do
    url_helpers.api_v1_staff_member_holiday_path(staff_member, holiday)
  end
  let(:response) do
    put(url, params)
  end
  let(:valid_params) do
    {
      start_date: UIRotaDate.format(new_start_date),
      end_date: UIRotaDate.format(new_end_date),
      holiday_type: new_holiday_type,
      note: ""
    }
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

    it 'should have updated the holiday' do
      holiday.reload
      expect(holiday.disabled?).to eq(true)
      expect(holiday.parent.present?).to eq(true)
      expect(holiday.parent.start_date).to eq(new_start_date)
      expect(holiday.parent.end_date).to eq(new_end_date)
      expect(holiday.parent.holiday_type).to eq(new_holiday_type)
    end

    it 'it should return created holiday' do
      json = JSON.parse(response.body)
      expect(json["id"]).to eq(staff_member.holidays.first.id)
      expect(json["start_date"]).to eq(UIRotaDate.format(staff_member.holidays.first.start_date))
      expect(json["end_date"]).to eq(UIRotaDate.format(staff_member.holidays.first.end_date))
      expect(json["holiday_type"]).to eq(staff_member.holidays.first.holiday_type)
      expect(json["creator"]).to eq(staff_member.holidays.first.creator.full_name)
  end
  
  end    

  context 'when validation errors occur' do
    let(:params) do
      valid_params.merge({
        start_date: '',
        end_date: '',
        holiday_type: ''
      })
    end

    it 'should return unprocessable_entity status' do
      expect(response.status).to eq(unprocessable_entity_status)
    end

    it 'should return errors json' do
      json = JSON.parse(response.body)
      expect(json).to eq({
        "errors" => {
          "startDate" => ["can't be blank"],
          "endDate" => ["can't be blank"],
          "holidayType" => ["is required"]
        }
      })
    end
  end
  
  context 'when validation errors occur, with invalid data' do
    let(:params) do
      valid_params.merge({
        start_date: UIRotaDate.format(invalid_start_date),
        end_date: UIRotaDate.format(invalid_end_date),
      })
    end

    it 'should return unprocessable_entity status' do
      expect(response.status).to eq(unprocessable_entity_status)
    end

    it 'should return errors json' do
      json = JSON.parse(response.body)
      expect(json).to eq({
        "errors" => {
          "startDate" => ["can't be changed to date in the past"],
          "endDate" => ["can't be changed to date in the past"],
        }
      })
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
