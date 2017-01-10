require 'rails_helper'

RSpec.describe 'Api access' do
  include Rack::Test::Methods
  include HeaderHelpers

  let(:staff_type) { FactoryGirl.create(:staff_type) }
  let(:user) { FactoryGirl.create(:user) }
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

  describe '#show' do
    let(:url) { url_helpers.api_v1_staff_type_path(staff_type) }

    describe 'response' do
      let(:response) { get(url) }

      specify 'should succeed' do
        expect(response.status).to eq(ok_status)
      end

      specify 'should return a json representation of the staff type' do
        json = JSON.parse(response.body)
        expect(json).to eq({
          "id" => staff_type.id,
          "url" => url_helpers.api_v1_staff_type_url(staff_type),
          "name" => staff_type.name,
          "color" => "##{staff_type.ui_color}"
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
