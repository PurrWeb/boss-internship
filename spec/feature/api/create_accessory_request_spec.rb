require 'rails_helper'

RSpec.describe 'Staff member create accessory requests API endpoint' do
  include Rack::Test::Methods
  include HeaderHelpers
  include ActiveSupport::Testing::TimeHelpers

  before do
    set_authorization_header(access_token.token)
  end

  let(:venue) { FactoryGirl.create(:venue) }
  let(:user) { FactoryGirl.create(:user, :ops_manager, venues: [venue]) }
  let(:staff_member) { FactoryGirl.create(:staff_member, master_venue: venue) }
  let(:accessory) { FactoryGirl.create(
    :accessory,
    venue: venue,
    user_requestable: true,
    accessory_type: Accessory.accessory_types[:uniform],
    size: 'S,M,L,XL,XXL'
  ) }
  let(:now) { Time.current }
  let(:access_token) do
    WebApiAccessToken.new(
      expires_at: 30.minutes.from_now,
      user: user
    ).persist!
  end
  let(:valid_params) do
    {
      accessoryId: accessory.id,
      size: 'XL',
    }
  end

  let(:create_response) do
    post(url_helpers.api_v1_staff_member_staff_member_accessory_requests_path(staff_member), params)
  end

  context 'before call' do
    it 'no accessories requests should exist' do
      expect(staff_member.accessory_requests.count).to eq(0)
    end
  end

  context 'create accessory request' do
    context ' with valid params' do
      let(:params) do
        valid_params
      end

      before do
        create_response
      end

      it 'should return ok status' do
        expect(create_response.status).to eq(ok_status)
      end

      it 'should create accessory request' do
        expect(staff_member.accessory_requests.count).to eq(1)
      end

      it 'it should return created accessory' do
        json = JSON.parse(create_response.body).except("createdAt", "updatedAt", "timeline")
        accessory_request = staff_member.accessory_requests.first
        expect(json).to eq({
          "id" => accessory_request.id,
          "frozen" => accessory_request.frozen?,
          "hasRefundRequest" => accessory_request.has_refund_request?,
          "accessoryName" => accessory_request.accessory.name,
          "size" => accessory_request.size,
          "status" => accessory_request.current_state,
          "refundRequestStatus" => nil,
        })
      end
    end

    context ' with invalid params' do
      let(:params) do
        valid_params.merge({accessoryId: nil})
      end

      before do
        create_response
      end

      it 'should return 422 status' do
        expect(create_response.status).to eq(unprocessable_entity_status)
      end

      it 'should return create accessory errors' do
        json = JSON.parse(create_response.body)
        expect(json).to eq({"errors"=>{"accessoryId"=>["can't be blank"]}})
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
