require 'rails_helper'

RSpec.describe 'Api access' do
  include Rack::Test::Methods
  let(:venue) { FactoryGirl.create(:venue) }
  let(:staff_members) { FactoryGirl.create_list(:staff_member, 2) }
  let(:user) { FactoryGirl.create(:user) }

  before do
    venue.update_attributes!(staff_members: staff_members)
    login_as user
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
          "name" => venue.name,
          "staff_member_ids" => staff_members.map(&:id)
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
