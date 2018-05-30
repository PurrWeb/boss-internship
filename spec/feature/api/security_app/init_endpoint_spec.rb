require 'rails_helper'

RSpec.describe 'Init endpoint' do
  include Rack::Test::Methods
  include HeaderHelpers

  let(:now) { Time.current }
  let(:mobile_app) { MobileApp.create!(name: MobileApp::SECURITY_APP_NAME) }
  let(:params) do
    {}
  end
  let(:url) { url_helpers.api_security_app_v1_init_index_path }
  let(:response) { get(url, params) }
  let(:access_token) do
    SecurityAppApiAccessToken.new(staff_member: staff_member).persist!
  end
  let(:venue_1) { FactoryGirl.create(:venue) }
  let(:rota_1_date) { RotaShiftDate.new(now + 1.day) }
  let(:rota_1) do
    FactoryGirl.create(
      :rota,
      :published,
      venue: venue_1,
      date: rota_1_date.rota_date
    )
  end
  let(:rota_shift_1) do
    FactoryGirl.create(
      :rota_shift,
      staff_member: staff_member,
      rota: rota_1,
      starts_at: rota_1_date.start_time,
      ends_at: rota_1_date.start_time + 8.hours
    )
  end
  let(:venue_2) { FactoryGirl.create(:venue) }
  let(:rota_2_date) { RotaShiftDate.new(now + 2.day) }
  let(:rota_2) do
    FactoryGirl.create(
      :rota,
      :published,
      venue: venue_2,
      date: rota_2_date.rota_date
    )
  end
  let(:rota_shift_2) do
    FactoryGirl.create(
      :rota_shift,
      staff_member: staff_member,
      rota: rota_2,
      starts_at: rota_2_date.start_time,
      ends_at: rota_2_date.start_time + 8.hours
    )
  end
  let(:rota_shifts) { [rota_shift_1, rota_shift_2] }

  before do
    mobile_app
    set_authorization_header(access_token.token)
    rota_shifts
  end

  context 'security staff member' do
    let(:staff_member) do
      FactoryGirl.create(
        :staff_member,
        :security,
        :with_password
      )
    end

    specify 'should succeed' do
      expect(response.status).to eq(ok_status)
    end

    specify 'should return user application data' do
      response_json = JSON.parse(response.body)

      expected_profile_page_data = {
        "staffMemberId" => staff_member.id,
        "staffMember" => {
          "id" => staff_member.id,
          "firstName" => staff_member.name.first_name,
          "surname" => staff_member.name.surname,
          "email" => staff_member.email,
          "avatarImageUrl" => staff_member.avatar_url,
          "phoneNumber" => staff_member.phone_number,
          "niNumber" => staff_member.national_insurance_number,
          "siaBadgeExpiryDate" => UIRotaDate.format(staff_member.sia_badge_expiry_date),
          "siaBadgeNumber" => staff_member.sia_badge_number,
          "dateOfBirth" => UIRotaDate.format(staff_member.date_of_birth),
          "address" => staff_member.address.address,
          "county" => staff_member.address.county,
          "country" => staff_member.address.country,
          "postcode" => staff_member.address.postcode
        }
      }
      expected_shift_page_data = {
        "staffMemberId" => staff_member.id,
        "rotaShifts" => rota_shifts.map do |rota_shift|
          {
            "id" => rota_shift.id,
            "staffMemberId" => staff_member.id,
            "venueId" => rota_shift.venue.id,
            "date" => UIRotaDate.format(rota_shift.date),
            "shiftType" => rota_shift.shift_type,
            "startsAt" => rota_shift.starts_at.utc.iso8601,
            "endsAt" => rota_shift.ends_at.utc.iso8601,
            "venueType" => rota_shift.venue.venue_type
          }
        end,
        "securityVenues" => [],
        "securityVenueShifts" => [],
        "venues" => Venue.all.map do |venue|
          {
            "id" => venue.id,
            "name" => venue.name,
            "venueType" => venue.venue_type
          }
        end
      }


      expect(response_json.fetch("profilePage")).to eq(expected_profile_page_data)
      expect(response_json.fetch("shiftsPage")).to eq(expected_shift_page_data)
    end
  end

  context 'non security staff member' do
    let(:staff_member) do
      FactoryGirl.create(
        :staff_member,
        :with_password
      )
    end

    specify 'should return 403' do
      expect(response.status).to eq(forbidden_entity_status)
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

  def forbidden_entity_status
    403
  end
end
