require 'rails_helper'

RSpec.describe 'Delete holiday API endpoint' do
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
    (now + 1.week).to_date
  end
  let(:end_date) do
    (now + 1.week + 2.days).to_date
  end
  let(:holiday_type) do
    Holiday::HOLIDAY_TYPES[0]
  end
  let(:now) { Time.current }
  let(:holiday) do
    FactoryGirl.create(
      :holiday,
      staff_member: staff_member,
      start_date: start_date,
      end_date: end_date,
      holiday_type: holiday_type,
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
    delete(url)
  end

  context 'before call' do
    it 'no holidays for staff member should exist' do
      expect(staff_member.holidays.count).to eq(0)
    end
  end
  
  context 'when deliting' do
    before do
      response
    end

    it 'should return ok status' do
      expect(response.status).to eq(ok_status)
    end

    it 'no active holidays for staff member should exist after deliting' do
      expect(staff_member.active_holidays.count).to eq(0)
    end

    it 'disabled holiday for staff member should exist after deliting' do
      expect(staff_member.holidays.count).to eq(1)
      expect(staff_member.holidays.first.disabled?).to eq(true)
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
