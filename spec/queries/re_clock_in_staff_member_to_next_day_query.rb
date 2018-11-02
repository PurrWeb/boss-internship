require "rails_helper"

describe ReClockInStaffMemberToNextDayQuery, :clocking do
  include Rack::Test::Methods
  include HeaderHelpers
  include ActiveSupport::Testing::TimeHelpers
  let(:mock_clocking_app_frontend_updates_service) do
    double 'mock clocking app frontend updates service'
  end

  let!(:venue) { FactoryGirl.create(:venue) }
  let(:user) { FactoryGirl.create(:user, venues: [venue]) }
  let!(:api_key) do
    ApiKey.create!(venue: venue, user: user, key_type: ApiKey::BOSS_KEY_TYPE)
  end
  let(:admin_staff_member) do
    FactoryGirl.create(:staff_member, staff_type: manager_staff_type)
  end
  let(:manager_staff_type) { FactoryGirl.create(:manager_staff_type) }

  let(:target_staff_member) { FactoryGirl.create(:staff_member) }

  let!(:threshold_minutes) { 30.minutes }
  let!(:business_day_start) { RotaShiftDate.new(Time.now).start_time }
  let!(:business_date) { RotaShiftDate.to_rota_date(business_day_start) }

  let(:token_expires_at) { 30.minutes.from_now }
  let(:access_token) do
    ApiAccessToken.new(
      staff_member: admin_staff_member,
      api_key: api_key,
    ).persist!
  end

  let(:service) do
    ReClockInStaffMemberToNextDayQuery.new
  end

  let(:call_time_that_pass_a_threshold) { business_day_start - threshold_minutes + 1.minutes }
  let(:call_time_that_doesnt_pass_a_threshold) { business_day_start - threshold_minutes - 1.second }
  let(:clock_in_url) { url_helpers.clock_in_api_v1_clocking_index_path }
  let(:start_break_url) { url_helpers.start_break_api_v1_clocking_index_path }
  let(:end_break_url) { url_helpers.end_break_api_v1_clocking_index_path }
  let(:clock_out_url) { url_helpers.clock_out_api_v1_clocking_index_path }
  let(:params) do
    {
      staff_member_id: target_staff_member.id,
    }
  end

  before do
    allow(ClockingAppFrontendUpdates).to receive(:new).and_return(mock_clocking_app_frontend_updates_service)
    allow(mock_clocking_app_frontend_updates_service).to(receive(:clocking_events_updates))
    allow(mock_clocking_app_frontend_updates_service).to(receive(:dispatch))
    set_authorization_header(access_token.token)
  end

  context "before call" do
    specify "no clock ins should exist" do
      expect(ClockInEvent.count).to eq(0)
    end

    specify "no clock in period should exist" do
      expect(ClockInPeriod.count).to eq(0)
    end

    specify "no hours acceptance period should exist" do
      expect(HoursAcceptancePeriod.count).to eq(0)
    end
  end

  context "when ClockInPeriod pass a threshold" do
    context "when clockin" do
      before do
        call_time = call_time_that_pass_a_threshold
        clock_in(call_time: call_time)
      end

      it "should return a ClockInPeriod" do
        service_result = service.all(date: RotaShiftDate.to_rota_date(business_day_start))
        expect(service_result.count).to eq(1)
      end
    end

    context "when start_break" do
      before do
        call_time = call_time_that_pass_a_threshold
        clock_in(call_time: call_time)
        start_break(call_time: call_time + 5.minutes)
      end

      it "should return a ClockInPeriod" do
        service_result = service.all(date: RotaShiftDate.to_rota_date(business_day_start))
        expect(service_result.count).to eq(1)
      end
    end

    context "when end_break" do
      before do
        call_time = call_time_that_pass_a_threshold
        clock_in(call_time: call_time)
        start_break(call_time: call_time + 5.minutes)
        end_break(call_time: call_time + 10.minutes)
      end

      it "should return a ClockInPeriod" do
        service_result = service.all(date: RotaShiftDate.to_rota_date(business_day_start))
        expect(service_result.count).to eq(1)
      end
    end
  end

  context "when ClockInPeriod ended" do
    before do
      call_time = call_time_that_doesnt_pass_a_threshold
      clock_in(call_time: call_time)
      clock_out(call_time: call_time + 1.minute)
    end

    it "should return a 0 ClockInPeriod" do
      service_result = service.all(date: RotaShiftDate.to_rota_date(business_day_start))
      expect(service_result.count).to eq(0)
    end
  end

  context "when ClockInPeriod doesn't pass a threshold" do
    context "when clockin" do
      before do
        call_time = call_time_that_doesnt_pass_a_threshold
        clock_in(call_time: call_time)
      end

      it "should return a 0 ClockInPeriod" do
        service_result = service.all(date: RotaShiftDate.to_rota_date(business_day_start))
        expect(service_result.count).to eq(0)
      end
    end

    context "when start_break" do
      before do
        call_time = call_time_that_doesnt_pass_a_threshold
        clock_in(call_time: call_time)
        start_break(call_time: call_time + 5.minutes)
      end

      it "should return a 0 ClockInPeriod" do
        service_result = service.all(date: RotaShiftDate.to_rota_date(business_day_start))
        expect(service_result.count).to eq(0)
      end
    end

    context "when end_break" do
      before do
        call_time = call_time_that_doesnt_pass_a_threshold
        clock_in(call_time: call_time)
        start_break(call_time: call_time + 5.minutes)
        end_break(call_time: call_time + 10.minutes)
      end

      it "should return a 0 ClockInPeriod" do
        service_result = service.all(date: RotaShiftDate.to_rota_date(business_day_start))
        expect(service_result.count).to eq(0)
      end
    end
  end

  def clock_in(call_time:)
    travel_to call_time do
      token = ApiAccessToken.new(
        expires_at: 30.minutes.from_now,
        api_key: api_key,
        staff_member: admin_staff_member,
      ).persist!
      set_authorization_header(token.token)
      post(clock_in_url, params)
    end
  end

  def clock_out(call_time:)
    travel_to call_time do
      token = ApiAccessToken.new(
        expires_at: 30.minutes.from_now,
        api_key: api_key,
        staff_member: admin_staff_member,
      ).persist!
      set_authorization_header(token.token)
      post(clock_out_url, params)
    end
  end

  def start_break(call_time:)
    travel_to call_time do
      token = ApiAccessToken.new(
        expires_at: 30.minutes.from_now,
        api_key: api_key,
        staff_member: admin_staff_member,
      ).persist!
      set_authorization_header(token.token)
      post(start_break_url, params)
    end
  end

  def end_break(call_time:)
    travel_to call_time do
      token = ApiAccessToken.new(
        expires_at: 30.minutes.from_now,
        api_key: api_key,
        staff_member: admin_staff_member,
      ).persist!
      set_authorization_header(token.token)
      post(end_break_url, params)
    end
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
