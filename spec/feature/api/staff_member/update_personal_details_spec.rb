require 'rails_helper'

RSpec.describe 'Update Personal Details' do
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
  let(:staff_member) do
    FactoryGirl.create(
      :staff_member,
      gender: old_gender,
      date_of_birth: old_date_of_birth,
      name: old_name_model
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
    url_helpers.update_personal_details_api_v1_staff_member_path(staff_member)
  end
  let(:valid_params) do
    {
      gender: new_gender,
      date_of_birth: UIRotaDate.format(new_date_of_birth),
      first_name: new_first_name,
      surname: new_surname
    }
  end
  let(:response) do
    travel_to now do
      post(url, params)
    end
  end
  let(:old_gender) { StaffMember::MALE_GENDER }
  let(:new_gender) { StaffMember::FEMALE_GENDER }
  let(:old_date_of_birth) { (now - 5.years).to_date }
  let(:new_date_of_birth) { (now - 2.years).to_date }
  let(:old_first_name) { "John" }
  let(:new_first_name) { "Joan" }
  let(:old_surname) { "Smitho" }
  let(:new_surname) { "Smitha" }

  before do
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
      expect(staff_member.gender).to eq(new_gender)
      expect(staff_member.date_of_birth).to eq(new_date_of_birth)
      expect(staff_member.name.first_name).to eq(new_first_name)
      expect(staff_member.name.surname).to eq(new_surname)
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
      expect(staff_member.gender).to eq(new_gender)
      expect(staff_member.date_of_birth).to eq(new_date_of_birth)
      expect(staff_member.name.first_name).to eq(new_first_name)
      expect(staff_member.name.surname).to eq(new_surname)
    end
  end

  context 'when validation errors occur' do
    let(:params) do
      valid_params.merge({
        first_name: '',
        surname: ''
      })
    end

    it 'should return unprocessable_entity status' do
      expect(response.status).to eq(unprocessable_entity_status)
    end

    it 'should return errors json' do
      json = JSON.parse(response.body)
      expect(json).to eq({
        "errors" => {
          "first_name"=>["can't be blank"],
          "surname"=>["can't be blank"]
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
