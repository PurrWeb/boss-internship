require 'rails_helper'
require 'feature/support/base_64_image'

RSpec.describe 'Api access' do
  include Rack::Test::Methods
  include HeaderHelpers

  let(:now) { Time.current }
  let(:staff_type) { FactoryGirl.create(:staff_type) }
  let(:venue) { FactoryGirl.create(:venue) }
  let(:master_venue) { venue }
  let(:pay_rate) { FactoryGirl.create(:pay_rate) }
  let(:api_key) do
    ApiKey.create!(
      venue: venue,
      user: user,
      key_type: ApiKey::BOSS_KEY_TYPE
    )
  end
  let(:user) { FactoryGirl.create(:user, venues: [venue]) }
  let(:access_token) do
    AccessToken.create!(
      token_type: 'web',
      expires_at: 30.minutes.from_now,
      creator: user,
      user: user
    )
  end

  before do
    set_authorization_header(access_token.token)
  end

  let(:user) do
    FactoryGirl.create(
      :user
    )
  end
  let(:access_token) do
    AccessToken.create(
      token_type: 'web',
      expires_at: 30.minutes.from_now,
      creator: api_key,
      api_key: api_key,
      user: user
    )
  end
  let(:first_name) { 'Jake' }
  let(:email_address) { 'foo@bar.car' }
  let(:address) { '4 foo street' }
  let(:url) { url_helpers.api_v1_staff_members_path }
  let(:params) do
    {
      pin_code: '21312',
      gender: 'male',
      phone_number: '2131233213',
      date_of_birth: now - 20.years,
      starts_at: now,
      national_insurance_number: 'JJ122322A',
      hours_preference_note: '',
      day_preference_note: '',
      employment_status_a: false,
      employment_status_b: false,
      employment_status_c: false,
      employment_status_d: false,
      employment_status_p45_supplied: false,
      first_name: first_name,
      surname: 'Snake',
      staff_type_id: staff_type.id,
      address: address,
      postcode: 'asdasada',
      county: 'bar county',
      country: 'Foo land',
      sia_badge_number: '1232231',
      sia_badge_expiry_date: now + 5.weeks,
      avatar_base64: Base64Image::EXAMPLE_URI,
      pay_rate_id: pay_rate.id,
      master_venue_id: master_venue.id,
      work_venue_ids: [],
      email_address: email_address
    }
  end

  before do
    user
  end

  context 'before call' do
    specify 'no staff members should exist' do
      expect(StaffMember.count).to eq(0)
    end
  end

  specify 'it should be success' do
    response = perform_post
    expect(response.status).to eq(ok_status)
  end

  specify 'it should create staff member' do
    perform_post
    expect(StaffMember.count).to eq(1)
  end

  specify 'it should return id of created staff member' do
    response = perform_post
    response_json = JSON.parse(response.body)
    expect(response_json.fetch("staff_member_id")).to eq(StaffMember.first.id)
  end

  context 'when first name is not supplied' do
    let(:first_name) { nil }

    specify 'it should return error' do
      response = perform_post
      expect(response.status).to eq(422)
    end

    specify 'it should not create staff member' do
      perform_post
      expect(StaffMember.count).to eq(0)
    end

    specify 'it should return correct error' do
      response = perform_post
      response_json = JSON.parse(response.body)
      expect(response_json.fetch("errors").fetch("first_name")).to eq(["can't be blank"])
    end
  end

  context 'when email address is not supplied' do
    let(:email_address) { nil }

    specify 'it should return error' do
      response = perform_post
      expect(response.status).to eq(422)
    end

    specify 'it should not create staff member' do
      perform_post
      expect(StaffMember.count).to eq(0)
    end

    specify 'it should return correct error' do
      response = perform_post
      response_json = JSON.parse(response.body)
      expect(response_json.fetch("errors").fetch("email_address")).to eq(["can't be blank"])
    end
  end

  context 'when address is not supplied' do
    let(:address) { nil }

    specify 'it should return error' do
      response = perform_post
      expect(response.status).to eq(422)
    end

    specify 'it should not create staff member' do
      perform_post
      expect(StaffMember.count).to eq(0)
    end

    specify 'it should return correct error' do
      response = perform_post
      response_json = JSON.parse(response.body)
      expect(response_json.fetch("errors").fetch("address")).to eq(["can't be blank"])
    end
  end

  private
  def perform_post
    post(url, params.to_json, {content_type: :json, accept: :json})
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

  def unprocessible_entity_status
    422
  end

  def unauthorised_status
    401
  end
end
