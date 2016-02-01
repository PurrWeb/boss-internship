require 'rails_helper'

RSpec.describe 'Api access' do
  include Rack::Test::Methods
  let(:staff_member) { FactoryGirl.create(:staff_member) }
  let(:user) { FactoryGirl.create(:user, venues: [staff_member.venue]) }

  before do
    login_as user
  end

  describe '#show' do
    let(:url) { url_helpers.api_v1_staff_member_path(staff_member) }

    describe 'response' do
      let(:response) { get(url) }

      specify 'should succeed' do
        expect(response.status).to eq(ok_status)
      end

      specify 'should return a json representation of the staff member' do
        json = JSON.parse(response.body)
        expect(json).to include({
          "id" => staff_member.id,
          "url" => url_helpers.api_v1_staff_member_url(staff_member),
          "staff_type" => {
            "id" => staff_member.staff_type.id,
            "url" => url_helpers.api_v1_staff_type_url(staff_member.staff_type)
          },
          "first_name" => staff_member.name.first_name,
          "surname" => staff_member.name.surname,
          "preferred_hours" => staff_member.hours_preference_note,
          "preferred_days" => staff_member.day_perference_note
        })

        expect(json["avatar_url"]).to match(/\/uploads\/staff_member\/avatar\/\d+\/avatar\.jpg/)
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

  def unauthorised_status
    401
  end
end
