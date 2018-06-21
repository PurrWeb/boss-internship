require 'rails_helper'

RSpec.describe 'Enable Staff Members' do
  include Rack::Test::Methods
  include HeaderHelpers
  include ActiveSupport::Testing::TimeHelpers

  let(:old_name_model) do
    FactoryGirl.create(
      :name,
      first_name: old_first_name,
      surname: old_surname
    )
  end
  let(:staff_member)do
    create_params = {
      starts_at: old_starts_at,
      gender: old_gender,
      date_of_birth: old_date_of_birth,
      national_insurance_number: old_national_insurance_number,
      pay_rate: old_pay_rate,
      name: old_name_model
    }
    EmploymentStatusApiEnum.new(value: old_employment_status).to_params do |param, value|
      create_params[param] = value
    end

    FactoryGirl.create(:staff_member, create_params)
  end
  let(:venue) { staff_member.master_venue }
  let(:user) { FactoryGirl.create(:user, :admin) }
  let(:api_key) do
    ApiKey.create!(
      venue: venue,
      user: user,
      key_type: ApiKey::BOSS_KEY_TYPE
    )
  end
  let(:access_token) do
    WebApiAccessToken.new(
      expires_at: 30.minutes.from_now,
      user: user
    ).persist!
  end
  let(:now) { Time.current }
  let(:create_time) { now - 1.week }
  let(:call_time) { now - 1.day }
  let(:url) do
    url_helpers.enable_api_v1_staff_member_path(staff_member)
  end
  let(:valid_params) do
    {
      startsAt: UIRotaDate.format(new_starts_at),
      mainVenue: new_main_venue.id,
      staffType: new_staff_type.id,
      otherVenues: new_other_venues.map(&:id),
      pinCode: new_pin_code,
      gender: new_gender,
      phoneNumber: new_phone_number,
      dateOfBirth: UIRotaDate.format(new_date_of_birth),
      nationalInsuranceNumber: new_national_insurance_number,
      payRate: new_pay_rate.id,
      employmentStatus: new_employment_status,
      firstName: new_first_name,
      surname: new_surname,
      address: new_address,
      postcode: new_postcode,
      country: new_country,
      county: new_county,
      emailAddress: new_email_address
    }
  end
  let(:response) do
    travel_to call_time do
      post(url, params)
    end
  end
  let(:old_starts_at) { create_time.to_date }
  let(:new_starts_at) { call_time.to_date }
  let(:new_staff_type) { FactoryGirl.create(:staff_type) }
  let(:new_main_venue) { FactoryGirl.create(:venue) }
  let(:new_other_venues) do
    Array.new(3) { FactoryGirl.create(:venue) }
  end
  let(:new_pin_code) { '8347338' }
  let(:old_gender) { StaffMember::FEMALE_GENDER  }
  let(:new_gender) { StaffMember::MALE_GENDER}
  let(:new_phone_number) { "dsadasas " }
  let(:old_date_of_birth) { (now - 40.years).to_date }
  let(:new_date_of_birth) { (now - 30.year).to_date }
  let(:old_national_insurance_number) { 'SE350280A' }
  let(:new_national_insurance_number) { 'JM235465D'}
  let(:old_employment_status) { EmploymentStatusApiEnum::UI_OPTION_A }
  let(:new_employment_status) { EmploymentStatusApiEnum::UI_OPTION_P45 }
  let(:old_pay_rate) { FactoryGirl.create(:pay_rate) }
  let(:new_pay_rate) { FactoryGirl.create(:pay_rate) }
  let(:pay_rates) { [new_pay_rate, old_pay_rate]}
  let(:old_first_name) { "John" }
  let(:new_first_name) { "Joan" }
  let(:old_surname) { "Smitho" }
  let(:new_surname) { "Smitha" }
  let(:new_address) { 'new Address' }
  let(:old_address) { 'old Address' }
  let(:new_postcode) { 'new Postcode' }
  let(:old_postcode) { 'old Postcode' }
  let(:new_country) { 'new Country' }
  let(:old_country) { 'old Country' }
  let(:new_county) { 'new County' }
  let(:old_county) { 'old County' }
  let(:new_email_address) { 'new.email@fake.com' }
  let(:old_email_address) { 'old.email@fake.com' }
  let(:null_frontend_updates) { double(FrontendUpdates).as_null_object }
  let(:null_ably_service) { double(AblyService).as_null_object }

  before do
    use_dummy_ably_service

    now
    pay_rates
    travel_to(create_time) do
      staff_member.tap do |sm|
        DeleteStaffMember.new(
          requester: user,
          staff_member: sm,
          would_rehire: true,
          disable_reason: 'nothing',
          frontend_updates: null_frontend_updates
        ).call
      end
    end
    travel_to(call_time) { set_authorization_header(access_token.token) }
  end

  context 'before call' do
    specify "staff member should be disabled" do
      expect(staff_member).to be_disabled
    end
  end

  context 'when valid params supplied' do
    let(:params) do
      valid_params
    end

    before do
      travel_to call_time do
        response
      end
    end

    it 'should return ok status' do
      expect(response.status).to eq(ok_status)
    end

    it 'should return staff member json' do
      travel_to call_time do
        test_member = StaffMember.find(staff_member.id)

        response_json = JSON.parse(response.body)

        expect(response_json).to eq(
          JSON.parse(
            Api::V1::StaffMemberProfile::StaffMemberSerializer.new(test_member.reload).to_json
          )
        )
      end
    end

    it 'should have updated the staff member' do
      #reload doesn't seem to be working with statesman gem
      test_member = StaffMember.find(staff_member.id)
      expect(test_member).to be_enabled
      expect(test_member.starts_at).to eq(new_starts_at)
      expect(test_member.master_venue.id).to eq(new_main_venue.id)
      expect(test_member.staff_type.id).to eq(new_staff_type.id)
      expect(test_member.work_venues.map(&:id)).to eq(new_other_venues.map(&:id))
      expect(test_member.pin_code_hash).to eq(BCrypt::Engine.hash_secret(new_pin_code, test_member.pin_code_salt))
      expect(test_member.gender).to eq(new_gender)
      expect(test_member.phone_number).to eq(new_phone_number)
      expect(test_member.date_of_birth).to eq(new_date_of_birth)
      expect(test_member.national_insurance_number).to eq(new_national_insurance_number)
      expect(test_member.pay_rate.id).to eq(new_pay_rate.id)
      EmploymentStatusApiEnum.new(value: new_employment_status).to_params do |param, value|
        expect(test_member.public_send(param)).to eq(value)
      end
      expect(test_member.name.first_name).to eq(new_first_name)
      expect(test_member.name.surname).to eq(new_surname)
      expect(test_member.address.address).to eq(new_address)
      expect(test_member.address.postcode).to eq(new_postcode)
      expect(test_member.address.country).to eq(new_country)
      expect(test_member.address.county).to eq(new_county)
      expect(test_member.email).to eq(new_email_address)
    end
  end

  context 'validation error' do
    let(:params) do
      valid_params.merge({
        gender: '',
        firstName: '',
        address: '',
        pinCode: 'dsd'
      })
    end

    it 'should return unprocessable_entity status' do
      expect(response.status).to eq(unprocessable_entity_status)
    end

    it 'should return error json' do
      json = JSON.parse(response.body)
      expect(json).to eq({
        "errors" => {
          "pinCode" => ["must be numerical"],
          "gender" => ["is required"],
          "firstName" => ["can't be blank"],
          "address" => ["can't be blank"]
        }
      })
    end

    it 'should not have updated the staff member' do
      response
      staff_member.reload
      expect(staff_member).to be_disabled
    end
  end

  context 'when security staff type' do
    let(:security_staff_type) { FactoryGirl.create(:security_staff_type) }
    let(:new_staff_type) { security_staff_type }
    let(:params) { valid_params }

    it 'should return unprocessable_entity status' do
      expect(response.status).to eq(unprocessable_entity_status)
    end

    it 'should return errors json' do
      json = JSON.parse(response.body)
      expect(json).to eq({
        "errors" => {
          "mainVenue" => ["must be blank"],
          "siaBadgeNumber" => ["is required"],
          "siaBadgeExpiryDate" => ["is required"]
        }
      })
    end

    context 'security fields are also supplied' do
      let(:new_sia_badge_number) { '212313' }
      let(:new_sia_badge_expiry_date) { (now + 3.months).to_date }
      let(:params) do
        valid_params.merge({
          mainVenue: nil,
          siaBadgeNumber: new_sia_badge_number,
          siaBadgeExpiryDate: UIRotaDate.format(new_sia_badge_expiry_date)
        })
      end

      before do
        response
      end

      it 'should return ok status' do
        expect(response.status).to eq(ok_status)
      end

      it 'should have updated the staff member' do
        staff_member.reload
        expect(staff_member.master_venue).to eq(nil)
        expect(staff_member.sia_badge_number).to eq(new_sia_badge_number)
        expect(staff_member.sia_badge_expiry_date).to eq(new_sia_badge_expiry_date)
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
