require 'rails_helper'

RSpec.describe 'Api access' do
  include Rack::Test::Methods

  describe '#get' do
    let(:url) { url_helpers.get_api_v1_test_index_path }
    let(:staff_member) { FactoryGirl.create(:staff_member) }

    specify 'unathenticated users should not have access' do
      response = get(url)
      expect(response.status).to eq(unauthorised_status)
    end

    context 'authenticated user' do
      let(:user) { FactoryGirl.create(:user) }

      before do
        login_as user
      end

      specify 'should have access' do
        response = get(url)
        expect(response.status).to eq(ok_status)
      end
    end
  end

  describe '#post' do
    let(:url) { url_helpers.post_api_v1_test_index_path }
    let(:staff_member) { FactoryGirl.create(:staff_member) }

    specify 'unathenticated users should not have access' do
      response = post(url)
      expect(response.status).to eq(unauthorised_status)
    end

    context 'authenticated user' do
      let(:user) { FactoryGirl.create(:user) }

      before do
        login_as user
      end

      specify 'should have access' do
        response = post(url)
        expect(response.status).to eq(ok_status)
      end

      specify 'supplied json values should be passed to the app' do
        message = 'hi there'
        response = post(url, { message: message })

        expect(
          JSON.parse(response.body)
        ).to eq(
          {
            "message" => message
          }
        )
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
