require 'rails_helper'

RSpec.describe 'Destroy owed hour API endpoint' do
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
  let(:old_date) do
    (now - 1.week).to_date
  end
  let(:old_pay_slip_week) do
    RotaWeek.new(old_date + 1.week)
  end
  let(:old_starts_at) do
    RotaShiftDate.new(old_date).start_time
  end
  let(:old_ends_at) do
    RotaShiftDate.new(old_date).start_time + 40.minutes
  end
  let(:now) { Time.current }
  let(:owed_hour) do
    FactoryGirl.create(
      :owed_hour,
      staff_member: staff_member,
      date: old_date,
      payslip_date: old_pay_slip_week.start_date,
      finance_report: finance_report,
      starts_at: old_starts_at,
      ends_at: old_ends_at,
    )
  end
  let(:finance_report) do
    FactoryGirl.create(
      :finance_report,
      staff_member: staff_member,
      venue: staff_member.master_venue,
      week_start: old_pay_slip_week.start_date
    )
  end
  let(:access_token) do
    WebApiAccessToken.new(
      expires_at: 30.minutes.from_now,
      user: user
    ).persist!
  end
  let(:url) do
    url_helpers.api_v1_staff_member_owed_hour_path(staff_member, owed_hour)
  end
  let(:response) do
    delete(url)
  end

  before do
    owed_hour
  end

  context 'before call' do
    it 'active owed hours for staff member should exist' do
      expect(staff_member.owed_hours.enabled.count).to eq(1)
    end
  end

  context 'when valid params supplied' do
    before do
      response
    end

    it 'should return ok status' do
      expect(response.status).to eq(ok_status)
    end

    it 'no active owed hours for staff member should exist after deliting' do
      expect(staff_member.owed_hours.enabled.count).to eq(0)
    end

    it 'disabled owed hours for staff member should exist after deliting' do
      expect(staff_member.owed_hours.count).to eq(1)
      expect(staff_member.owed_hours.first.disabled?).to eq(true)
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
