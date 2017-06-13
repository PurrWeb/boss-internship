require 'rails_helper'

RSpec.describe 'Flagged staff member endpoint' do
  include Rack::Test::Methods
  include HeaderHelpers

  let(:api_key) do
    ApiKey.create!(
      venue: venue,
      user: user,
      key_type: ApiKey::BOSS_KEY_TYPE
    )
  end
  let(:venue) { FactoryGirl.create(:venue) }
  let(:user) { FactoryGirl.create(:user, venues: [venue]) }
  let(:access_token) do
    AccessToken.create!(
      token_type: 'web',
      expires_at: 30.minutes.from_now,
      creator: user,
      user: user
    )
  end
  let(:url) do
    url_helpers.flagged_api_v1_staff_members_path
  end
  let(:first_name) { 'random' }
  let(:surname) { 'lady' }
  let(:date_of_birth) { 20.years.ago.iso8601 }
  let(:email) { 'random.lady@fake.com' }
  let(:national_insurance_number) { 'JN208733B' }
  let(:params) do
    {
      first_name: first_name,
      surname: surname,
      date_of_birth: date_of_birth,
      email_address: email,
      national_insurance_number: national_insurance_number
    }
  end

  before do
    set_authorization_header(access_token.token)
  end

  let(:response) { post(url, params) }

  specify 'should succeed' do
    expect(response.status).to eq(ok_status)
  end

  specify 'should return a json representation' do
    json = JSON.parse(response.body)
    expect(json.fetch("staff_members")).to eq([])
  end

  describe 'required params' do
    Api::V1::StaffMembersController.required_flagged_staff_member_fields.each do |required_param|
      context "when required #{required_param} param is not supplied" do
        before do
          params.delete(required_param.to_sym)
        end

        specify 'it should return unprocessable entity status' do
          expect(response.status).to eq(unprocessable_entity_status)
        end
      end
    end

    context 'flagged staff member exists' do
      let(:name) { Name.create!(first_name: first_name, surname: surname) }
      let(:email_address) { EmailAddress.create!(email: email) }
      let(:flagged_staff_member) do
        FactoryGirl.create(
          :staff_member,
          :flagged,
          name: name,
          email_address: email_address,
          date_of_birth: date_of_birth,
          national_insurance_number: national_insurance_number
        )
      end

      specify 'should return a json representation' do
        flagged_staff_member

        json = JSON.parse(response.body)
        expect(json.fetch("staff_members")).to eq([
          {
            "id" => flagged_staff_member.id,
            "date_of_birth" => flagged_staff_member.date_of_birth.strftime("%F"),
            "url" => url_helpers.api_v1_staff_member_url(flagged_staff_member),
            "avatar_url" => flagged_staff_member.avatar_url,
            "staff_type" => flagged_staff_member.staff_type.name,
            "first_name" => flagged_staff_member.name.first_name,
            "surname" => flagged_staff_member.name.surname,
            "preferred_hours" => flagged_staff_member.hours_preference_note,
            "preferred_days" => flagged_staff_member.day_perference_note,
            "email_address" => flagged_staff_member.email_address.email,
            "disabled_by_user" => flagged_staff_member.disabled_by_user.full_name,
            "disabled_at" => flagged_staff_member.disabled_at.to_s(:human_date),
            "disable_reason" => flagged_staff_member.disable_reason
          }
        ])
      end
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
