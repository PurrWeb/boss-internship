require 'rails_helper'

RSpec.describe 'Update Contact Details' do
  include Rack::Test::Methods
  include HeaderHelpers
  include ActiveSupport::Testing::TimeHelpers

  let(:old_address_model) do
    FactoryGirl.create(
      :address,
      address: old_address,
      postcode: old_postcode,
      country: old_country,
      county: old_county,
    )
  end
  let(:old_email_address_model) do
    FactoryGirl.create(
      :email_address,
      email: old_email_address
    )
  end
  let(:staff_member) do
    FactoryGirl.create(
      :staff_member,
      address: old_address_model,
      phone_number: old_phone_number,
      email_address: old_email_address_model
    )
  end
  let(:venue) { staff_member.master_venue }
  let(:user) { FactoryGirl.create(:user, venues: [venue]) }
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
  let(:url) do
    url_helpers.update_contact_details_api_v1_staff_member_path(staff_member)
  end
  let(:valid_params) do
    {
      phone_number: new_phone_number,
      address: new_address,
      postcode: new_postcode,
      country: new_country,
      county: new_county,
      email_address: new_email_address
    }
  end
  let(:response) do
    travel_to now do
      post(url, params)
    end
  end
  let(:old_phone_number) { '123456789' }
  let(:new_phone_number) { '987654321' }
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

  before do
    set_authorization_header(access_token.token)
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

    it 'should return staff member json' do
      staff_member.reload

      response_json = JSON.parse(response.body)
      expect(response_json).to eq(
        JSON.parse(
          Api::V1::StaffMemberProfile::StaffMemberSerializer.new(staff_member).to_json
        )
      )
    end

    it 'should have updated the staff member' do
      staff_member.reload
      expect(staff_member.address.address).to eq(new_address)
      expect(staff_member.address.postcode).to eq(new_postcode)
      expect(staff_member.address.country).to eq(new_country)
      expect(staff_member.address.county).to eq(new_county)
      expect(staff_member.email).to eq(new_email_address)
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

    it 'should have updated the staff member' do
      staff_member.reload
      expect(staff_member.address.address).to eq(new_address)
      expect(staff_member.address.postcode).to eq(new_postcode)
      expect(staff_member.address.country).to eq(new_country)
      expect(staff_member.address.county).to eq(new_county)
      expect(staff_member.email).to eq(new_email_address)
    end
  end

  context 'when validation errors occur' do
    let(:params) do
      valid_params.merge({
        address: "",
        email_address: ""
      })
    end

    it 'should return unprocessable_entity status' do
      expect(response.status).to eq(unprocessable_entity_status)
    end

    it 'should return errors json' do
      json = JSON.parse(response.body)
      expect(json).to eq({
        "errors" => {
          "address" => ["can't be blank"],
          "email_address" => ["can't be blank"]
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
