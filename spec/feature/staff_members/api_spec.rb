require 'rails_helper'

RSpec.describe 'Staff member pages access' do
  include Rack::Test::Methods

  let(:user) { FactoryGirl.create(:user, venues: [staff_member.venues.first]) }
  let(:staff_member) { FactoryGirl.create(:staff_member) }

  before do
    login_as user
  end

  specify do
    response = get(url_helpers.api_v1_staff_member_path(staff_member), {}, json_request_env)
    expect(response.status).to eq(200)
  end

  private
  def app
    Rails.application
  end

  def url_helpers
    Rails.application.routes.url_helpers
  end

  def json_request_env
    { "CONTENT_TYPE" => "application/json" }
  end
end
