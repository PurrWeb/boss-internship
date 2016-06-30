require 'rails_helper'

RSpec.describe 'Api access' do
  include Rack::Test::Methods
  include HeaderHelpers

  let(:venue) { FactoryGirl.create(:venue) }
  let(:staff_members) { FactoryGirl.create_list(:staff_member, 2) }
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
    staff_members.each do |staff_member|
      staff_member.update_attributes!(master_venue: venue)
    end
    set_token_header(access_token)
  end

  describe '#show' do
    let(:url) { url_helpers.api_v1_venue_path(venue) }

    describe 'response' do
      let(:response) { get(url) }

      specify 'should succeed' do
        expect(response.status).to eq(ok_status)
      end

      specify 'should return a json representation of the staff member' do
        json = JSON.parse(response.body)
        expect(json).to eq({
          "id" => venue.id,
          "url" => url_helpers.api_v1_venue_url(venue),
          "name" => venue.name
        })
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
