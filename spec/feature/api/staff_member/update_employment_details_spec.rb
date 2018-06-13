require 'rails_helper'

RSpec.describe 'Update Employment Details' do
  include Rack::Test::Methods
  include HeaderHelpers
  include ActiveSupport::Testing::TimeHelpers

  let(:staff_member) do
    create_params = {
      master_venue: old_master_venue,
      work_venues: [],
      pay_rate: old_pay_rate,
      staff_type: old_staff_type,
      starts_at: old_starts_at,
      national_insurance_number: old_national_insurance_number,
      sage_id: old_sage_id
    }
    EmploymentStatusApiEnum.new(value: old_employment_status).to_params do |param, value|
      create_params[param] = value
    end
    FactoryGirl.create(:staff_member, create_params)
  end
  let(:venue) { staff_member.master_venue }
  let(:user_venues) { related_with_user_venues }
  let(:user) { FactoryGirl.create(:user, venues: user_venues) }
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
    url_helpers.update_employment_details_api_v1_staff_member_path(staff_member)
  end
  let(:valid_params) do
    {
      master_venue_id: new_master_venue.id,
      other_venue_ids: new_related_with_user_other_venue_ids,
      staff_type_id: new_staff_type.id,
      starts_at: UIRotaDate.format(new_starts_at),
      employment_status: new_employment_status,
      pay_rate_id: new_pay_rate.id,
      national_insurance_number: new_national_insurance_number,
      sage_id: new_sage_id,
    }
  end
  let(:response) do
    travel_to now do
      post(url, params)
    end
  end
  let(:venues) { Array.new(10) { FactoryGirl.create(:venue) } }
  let(:old_master_venue) {venues[0]}
  let(:new_master_venue) {venues[1]}
  let(:related_with_user_venues) {venues[0..5]}
  let(:new_related_with_user_other_venues) { related_with_user_venues[2..5] }
  let(:new_unrelated_with_user_other_venues) { venues[6..10] }
  let(:new_related_with_user_other_venue_ids) { new_related_with_user_other_venues.map(&:id) }
  let(:new_unrelated_with_user_other_venue_ids) { new_unrelated_with_user_other_venues.map(&:id) }
  let(:old_staff_type) { FactoryGirl.create(:staff_type) }
  let(:new_staff_type) { FactoryGirl.create(:staff_type) }
  let(:old_starts_at) { (now - 2.months).to_date }
  let(:new_starts_at) { (now - 1.month).to_date }
  let(:old_employment_status) { EmploymentStatusApiEnum::UI_OPTION_A }
  let(:new_employment_status) { EmploymentStatusApiEnum::UI_OPTION_P45 }
  let(:pay_rates) { [new_pay_rate, old_pay_rate]}
  let(:old_pay_rate) { FactoryGirl.create(:pay_rate) }
  let(:new_pay_rate) { FactoryGirl.create(:pay_rate) }
  let(:old_national_insurance_number) { 'SE350280A' }
  let(:new_national_insurance_number) { 'JM352380D' }
  let(:new_sage_id) { 'N3WS@GE!D' }
  let(:old_sage_id) { '0LDS@GE!D' }

  before do
    old_master_venue
    pay_rates
    use_dummy_ably_service
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
      expect(staff_member.master_venue.id).to eq(new_master_venue.id)
      expect(staff_member.work_venues.map(&:id)).to eq(new_related_with_user_other_venue_ids)
      expect(staff_member.staff_type.id).to eq(new_staff_type.id)
      expect(staff_member.starts_at).to eq(new_starts_at)
      expect(staff_member.pay_rate.id).to eq(new_pay_rate.id)
      expect(staff_member.national_insurance_number).to eq(new_national_insurance_number)
      EmploymentStatusApiEnum.new(value: new_employment_status).to_params do |param, value|
        expect(staff_member.public_send(param)).to eq(value)
      end
    end
  end

  context 'supply invalid employment_status' do
    let(:params) do
      valid_params.merge({
        employment_status: 'h'
      })
    end

    it 'should throw error' do
      expect{ response.status}.to raise_error(RuntimeError, 'supplied value "h" invalid')
    end
  end

  context 'when validation errors occur' do
    let(:params) do
      valid_params.merge({
        national_insurance_number: 'adsad'
      })
    end

    it 'should return unprocessable_entity status' do
      expect(response.status).to eq(unprocessable_entity_status)
    end

    it 'should return errors json' do
      json = JSON.parse(response.body)
      expect(json).to eq({
        "errors" => {
          "national_insurance_number" => ["format must be 2 letters, followed by 6 numbers, and a letter "]
        }
      })
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
          "master_venue" => ["must be blank"],
          "sia_badge_number" => ["is required"],
          "sia_badge_expiry_date" => ["is required"]
        }
      })
    end

    context 'security fields are also supplied' do
      let(:new_sia_badge_number) { '212313' }
      let(:new_sia_badge_expiry_date) { (now + 3.months).to_date }
      let(:params) do
        valid_params.merge({
          master_venue_id: nil,
          sia_badge_number: new_sia_badge_number,
          sia_badge_expiry_date: UIRotaDate.format(new_sia_badge_expiry_date)
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
