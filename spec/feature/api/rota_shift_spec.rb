require 'rails_helper'

RSpec.describe 'Api access' do
  include Rack::Test::Methods
  let(:rota_shift) { FactoryGirl.create(:rota_shift) }
  let(:user) { FactoryGirl.create(:user) }

  before do
    login_as user
  end

  describe '#show' do
    let(:url) { url_helpers.api_v1_rota_shift_path(rota_shift) }

    describe 'response' do
      let(:response) { get(url) }

      specify 'should succeed' do
        expect(response.status).to eq(ok_status)
      end

      specify 'should return a json representation of the staff member' do
        json = JSON.parse(response.body)
        expect(json).to eq({
          "id" => rota_shift.id,
          "url" => url_helpers.api_v1_rota_shift_url(rota_shift),
          "rota" => {
            "id" => rota_shift.rota.id,
            "url" => url_helpers.api_v1_rota_url(rota_shift.rota)
          },
          "starts_at" => rota_shift.starts_at.iso8601,
          "ends_at" => rota_shift.ends_at.iso8601,
          "staff_member" => {
            "id" => rota_shift.staff_member.id,
            "url" => url_helpers.api_v1_staff_member_url(rota_shift.staff_member)
          }
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
end
